import { CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { CustomMessageQueueValidator, MessageQueueRoute } from '../models/routes';
import { InvalidRequestError, NoMatchedRouteError } from '../models/routerError';
import { debug, log } from '../helpers/log';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionResult } from '../models/cloudFunctionResult';
import { matchObjectPattern } from '../helpers/matchObjectPattern';

const validateQueueId = (context: CloudFunctionContext, queueIds: string[] | undefined, message: CloudFunctionMessageQueueEventMessage) => {
    if (queueIds) {
        const result = queueIds.some((queueId) => message.details.queue_id === queueId);

        debug(context.requestId, `Validating queue id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.queue_id,
            route: queueIds
        });

        return result;
    } else {
        return true;
    }
};

const validateBodyJson = (context: CloudFunctionContext, pattern: object | undefined, message: CloudFunctionMessageQueueEventMessage) => {
    if (pattern) {
        debug(context.requestId, 'Validating message body json', { pattern, body: message.details.message.body });

        try {
            const bodyObject = JSON.parse(message.details.message.body);
            const result = matchObjectPattern(bodyObject, pattern);
            debug(context.requestId, 'Validating message body json', { bodyObject, result });

            return result;
        } catch (e) {
            debug(context.requestId, 'Validating message body json failed with error', { error: e });

            if (e instanceof SyntaxError) {
                return false;
            } else {
                throw e;
            }
        }
    } else {
        return true;
    }
};

const validateBodyPattern = (
    context: CloudFunctionContext,
    pattern: RegExp | undefined,
    message: CloudFunctionMessageQueueEventMessage
) => {
    if (pattern) {
        debug(context.requestId, 'Validating message body pattern', { pattern, body: message.details.message.body });

        if (message.details.message.body) {
            const result = pattern.test(message.details.message.body);
            debug(context.requestId, 'Validating message body pattern', { result });

            return result;
        } else {
            return false;
        }
    } else {
        return true;
    }
};

const validateWithValidators = (
    validators: CustomMessageQueueValidator[] | undefined,
    event: CloudFunctionTriggerEvent,
    context: CloudFunctionContext,
    message: CloudFunctionMessageQueueEventMessage
) => {
    try {
        return validators ? validators.every((validator) => validator(event, context, message)) : true;
    } catch (e) {
        log('WARN', context.requestId, `Validator failed with error: ${(e?.toString() ?? 'unknown error').replace(/[\r\n]+/g, '')}`, {});
        return false;
    }
};

const messageQueueRouter: (
    routes: MessageQueueRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionMessageQueueEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFunctionResult> = async (routes, event, message, context) => {
    debug(context.requestId, 'Message queue processing started', {});

    for (const { queueId, body, validators, handler } of routes) {
        const matched =
            validateQueueId(context, queueId, message) &&
            validateBodyJson(context, body?.json, message) &&
            validateBodyPattern(context, body?.pattern, message);

        debug(context.requestId, 'Message queue matching completed', { message, matched, queueId: queueId ?? '', body: body ?? '' });

        if (matched) {
            const validatorsPassed = validateWithValidators(validators, event, context, message);

            debug(context.requestId, 'Message queue validating completed', { validatorsPassed });

            if (validatorsPassed) {
                const result = handler(event, context, message);

                debug(context.requestId, 'Message queue processed', {});

                return result instanceof Promise ? result : Promise.resolve(result);
            } else {
                log('WARN', context.requestId, 'Invalid request', {});
                throw new InvalidRequestError('Invalid request.');
            }
        }
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { messageQueueRouter };
