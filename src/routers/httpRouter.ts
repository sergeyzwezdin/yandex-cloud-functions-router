import { CustomHttpValidator, HttpRoute, HttpRouteBodyPatternValidate, HttpRouteParamValidate } from '../models/routes';
import { HttpParamNotSupportedTypeRouteError, InvalidRequestError, NoMatchedRouteError } from '../models/routerError';
import { debug, log } from '../helpers/log';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionHttpEvent } from '../models/cloudFunctionEvent';
import { CloudFuntionResult } from '../models/cloudFunctionResult';
import { RouterOptions } from '../models/routerOptions';
import { appendCorsHeadersToMainResponse } from './http/cors/appendCorsHeadersToMainResponse';
import { handleCorsPreflight } from './http/cors/handleCorsPreflight';
import { matchObjectPattern } from '../helpers/matchObjectPattern';
import { resolveCorsOptions } from './http/cors/resolveCorsOptions';

const validateHttpMethod = (httpMethod: string[] | undefined, event: CloudFunctionHttpEvent) => {
    const result = httpMethod
        ? httpMethod.map((m) => m.trim().toLowerCase()).indexOf(event.httpMethod.trim().toLocaleLowerCase()) !== -1
        : true;

    debug(event.requestContext.requestId, `Validating HTTP method: ${result ? 'valid' : 'invalid'}`, {
        allowed: httpMethod ?? '',
        actual: event.httpMethod
    });

    return result;
};

const validateParams = (params: HttpRouteParamValidate | undefined, event: CloudFunctionHttpEvent) => {
    if (params) {
        const eventParams = Object.entries(event.queryStringParameters).reduce<{ [name: string]: string }>(
            (result, [key, value]) => ({ ...result, [key.trim().toLowerCase()]: value }),
            {}
        );
        const handlerParams = Object.entries(params).reduce<HttpRouteParamValidate>(
            (result, [key, value]) => ({ ...result, [key.trim().toLowerCase()]: value }),
            {}
        );

        debug(event.requestContext.requestId, 'Validating HTTP params', { request: eventParams, route: handlerParams });

        const validationErrorFound = Object.entries(handlerParams).some(([name, { type, value, pattern }]) => {
            const eventParamValue = eventParams[name];

            if (type === 'exact') {
                debug(
                    event.requestContext.requestId,
                    `Validating ${name} param (type - exact): ${!(value === eventParamValue) ? 'invalid' : 'valid'}`,
                    { request: eventParamValue, route: value ?? '' }
                );
                return !(value === eventParamValue);
            } else if (type === 'substring') {
                if (value) {
                    debug(
                        event.requestContext.requestId,
                        `Validating ${name} param (type - substring): ${!(eventParamValue.indexOf(value) !== -1) ? 'invalid' : 'valid'}`,
                        { request: eventParamValue, route: value ?? '' }
                    );
                    return !(eventParamValue.indexOf(value) !== -1);
                } else {
                    // throw validation error on empty value
                    debug(event.requestContext.requestId, `Validating ${name} param (type - substring): invalid`, {
                        request: eventParamValue,
                        route: '(empty value)'
                    });
                    return true;
                }
            } else if (type === 'regexp') {
                debug(
                    event.requestContext.requestId,
                    `Validating ${name} param (type - regexp): ${!(pattern?.test(eventParamValue) ?? false) ? 'invalid' : 'valid'}`,
                    { request: eventParamValue, route: value ?? '' }
                );
                return !(pattern?.test(eventParamValue) ?? false);
            } else {
                debug(event.requestContext.requestId, `Validating ${name} param: unknown validation type - ${type}`, {
                    request: eventParamValue,
                    route: value ?? ''
                });
                throw new HttpParamNotSupportedTypeRouteError(`Not supported type: ${type}`);
            }
        });

        return !validationErrorFound;
    } else {
        return true;
    }
};

const validateBodyPattern = (pattern: HttpRouteBodyPatternValidate | undefined, event: CloudFunctionHttpEvent) => {
    if (pattern) {
        debug(event.requestContext.requestId, 'Validating HTTP body', { pattern });

        if (pattern.json) {
            try {
                const contentTypeMatched =
                    String((Object.entries(event.headers).find(([name]) => name.trim().toLowerCase() === 'content-type') ?? [])[1] || '')
                        .toLowerCase()
                        .indexOf('application/json') !== -1;

                debug(event.requestContext.requestId, 'Validating HTTP body type (JSON)', { contentTypeMatched });

                if (contentTypeMatched) {
                    const bodyObject = JSON.parse(event.body);

                    const result = matchObjectPattern(bodyObject, pattern.json);
                    debug(event.requestContext.requestId, 'Validating HTTP body', { bodyObject, result });

                    return result;
                } else {
                    return false;
                }
            } catch (e) {
                debug(event.requestContext.requestId, 'Validating HTTP body failed with error', { error: e });

                if (e instanceof SyntaxError) {
                    return false;
                } else {
                    throw e;
                }
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
};

const validateWithValidators = (
    validators: CustomHttpValidator[] | undefined,
    event: CloudFunctionHttpEvent,
    context: CloudFunctionContext
) => {
    try {
        return validators ? validators.every((validator) => validator(event, context)) : true;
    } catch (e) {
        log('WARN', context.requestId, `Validator failed with error: ${(e?.toString() ?? 'unknown error').replace(/[\r\n]+/g, '')}`, {});
        return false;
    }
};

const unwrapBase64Body: (event: CloudFunctionHttpEvent) => CloudFunctionHttpEvent = (event) => {
    if (event.isBase64Encoded) {
        const body = Buffer.from(event.body ?? '', 'base64').toString('utf-8');
        return { ...event, body, isBase64Encoded: false };
    } else {
        return event;
    }
};

const httpRouter: (
    routes: HttpRoute[],
    event: CloudFunctionHttpEvent,
    context: CloudFunctionContext,
    options?: RouterOptions
) => Promise<CloudFuntionResult> = async (routes, event, context, options) => {
    const corsOptions = resolveCorsOptions(options?.cors);

    debug(context.requestId, 'HTTP request processing started', { CORS: corsOptions });

    for (const { httpMethod, params, body, validators, decodeBase64Body, handler } of routes) {
        const matched = validateHttpMethod(httpMethod, event) && validateParams(params, event) && validateBodyPattern(body, event);

        debug(context.requestId, 'HTTP request matching completed', {
            matched,
            event,
            httpMethod: httpMethod ?? '',
            params: params ?? '',
            body: body ?? ''
        });

        if (matched) {
            const validatorsPassed = validateWithValidators(validators, event, context);

            debug(context.requestId, 'HTTP request validating completed', { validatorsPassed });

            if (validatorsPassed) {
                const handlerResult = handler(decodeBase64Body ? unwrapBase64Body(event) : event, context);
                const result = handlerResult instanceof Promise ? await handlerResult : handlerResult;

                debug(context.requestId, 'HTTP processed', {});

                return appendCorsHeadersToMainResponse(event, result, corsOptions);
            } else {
                log('WARN', context.requestId, 'Invalid request', {});
                throw new InvalidRequestError('Invalid request.');
            }
        }
    }

    const preflightResponse = handleCorsPreflight(event, corsOptions);

    if (preflightResponse) {
        debug(context.requestId, 'HTTP CORS preflight request processed', { preflightResponse });
        log('INFO', context.requestId, 'CORS preflight request handled ', {});
        return preflightResponse;
    } else {
        debug(context.requestId, 'HTTP CORS preflight request skipped', {});
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { httpRouter };
