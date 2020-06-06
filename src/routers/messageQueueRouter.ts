import { CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { CloudFuntionResult } from './../models/cloudFunctionResult';
import { MessageQueueRoute } from './../models/routes';
import { matchObjectPattern } from './../helpers/matchObjectPattern';

const validateQueueId = (queueId: string | undefined, message: CloudFunctionMessageQueueEventMessage) => {
    if (queueId) {
        return message.details.queue_id === queueId;
    } else {
        return true;
    }
};

const validateBodyJson = (pattern: object | undefined, message: CloudFunctionMessageQueueEventMessage) => {
    if (pattern) {
        try {
            const bodyObject = JSON.parse(message.details.message.body);
            return matchObjectPattern(bodyObject, pattern);
        } catch (e) {
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

const validateBodyPattern = (pattern: RegExp | undefined, message: CloudFunctionMessageQueueEventMessage) => {
    if (pattern) {
        if (message.details.message.body) {
            return pattern.test(message.details.message.body);
        } else {
            return false;
        }
    } else {
        return true;
    }
};

const messageQueueRouter: (
    routes: MessageQueueRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionMessageQueueEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFuntionResult> = async (routes, event, message, context) => {
    for (const { queueId, body, handler } of routes) {
        const matched =
            validateQueueId(queueId, message) && validateBodyJson(body?.json, message) && validateBodyPattern(body?.pattern, message);

        if (matched) {
            const result = handler(event, context, message);
            if (result instanceof Promise) {
                return result;
            } else {
                return Promise.resolve(result);
            }
        }
    }

    throw new Error('There is no matched route.');
};

export { messageQueueRouter };
