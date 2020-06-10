import { HttpParamNotSupportedTypeRouteError, NoMatchedRouteError } from '../models/routerError';
import { HttpRoute, HttpRouteBodyPatternValidate, HttpRouteParamValidate } from '../models/routes';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionHttpEvent } from '../models/cloudFunctionEvent';
import { CloudFuntionResult } from '../models/cloudFunctionResult';
import { RouterOptions } from '../models/routerOptions';
import { appendCorsHeadersToMainResponse } from './http/cors/appendCorsHeadersToMainResponse';
import { handleCorsPreflight } from './http/cors/handleCorsPreflight';
import { log } from '../helpers/log';
import { matchObjectPattern } from '../helpers/matchObjectPattern';
import { resolveCorsOptions } from './http/cors/resolveCorsOptions';

const validateHttpMethod = (httpMethod: string[] | undefined, event: CloudFunctionHttpEvent) =>
    httpMethod ? httpMethod.map((m) => m.trim().toLowerCase()).indexOf(event.httpMethod.trim().toLocaleLowerCase()) !== -1 : true;

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

        const validationErrorFound = Object.entries(handlerParams).some(([name, { type, value, pattern }]) => {
            const eventParamValue = eventParams[name];

            if (type === 'exact') {
                return !(value === eventParamValue);
            } else if (type === 'substring') {
                if (value) {
                    return !(eventParamValue.indexOf(value) !== -1);
                } else {
                    // throw validation error on empty value
                    return true;
                }
            } else if (type === 'regexp') {
                return !(pattern?.test(eventParamValue) ?? false);
            } else {
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
        if (pattern.json) {
            try {
                const contentTypeMatched =
                    String(event.headers['Content-Type'] || '')
                        .toLowerCase()
                        .indexOf('application/json') !== -1;

                if (contentTypeMatched) {
                    const bodyObject = JSON.parse(event.body);
                    return matchObjectPattern(bodyObject, pattern.json);
                } else {
                    return false;
                }
            } catch (e) {
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

const httpRouter: (
    routes: HttpRoute[],
    event: CloudFunctionHttpEvent,
    context: CloudFunctionContext,
    options?: RouterOptions
) => Promise<CloudFuntionResult> = async (routes, event, context, options) => {
    const corsOptions = resolveCorsOptions(options?.cors);

    for (const { httpMethod, params, body, handler } of routes) {
        const matched = validateHttpMethod(httpMethod, event) && validateParams(params, event) && validateBodyPattern(body, event);

        if (matched) {
            const handlerResult = handler(event, context);
            const result = handlerResult instanceof Promise ? await handlerResult : handlerResult;

            return appendCorsHeadersToMainResponse(event, result, corsOptions);
        }
    }

    const preflightResponse = handleCorsPreflight(event, corsOptions);
    if (preflightResponse) {
        log('INFO', context.requestId, 'CORS preflight request handled ', {});
        return preflightResponse;
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { httpRouter };
