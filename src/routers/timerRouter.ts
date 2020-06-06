import { CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { CloudFuntionResult } from './../models/cloudFunctionResult';
import { TimerRoute } from './../models/routes';

const validateTriggerId = (triggerId: string | undefined, message: CloudFunctionTimerEventMessage) => {
    if (triggerId) {
        return message.details.trigger_id === triggerId;
    } else {
        return true;
    }
};

const timerRouter: (
    routes: TimerRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionTimerEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFuntionResult> = async (routes, event, message, context) => {
    for (const { handler, triggerId } of routes) {
        const matched = validateTriggerId(triggerId, message);

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

export { timerRouter };
