import { CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { debug, log } from '../helpers/log';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionResult } from '../models/cloudFunctionResult';
import { NoMatchedRouteError } from '../models/routerError';
import { TimerRoute } from '../models/routes';

const validateTriggerId = (context: CloudFunctionContext, triggerIds: string[] | undefined, message: CloudFunctionTimerEventMessage) => {
    if (triggerIds) {
        const result = triggerIds.some((triggerId) => message.details.trigger_id === triggerId);
        debug(context.requestId, `Validating trigger id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.trigger_id,
            route: triggerIds
        });

        return result;
    } else {
        return true;
    }
};

const timerRouter: (
    routes: TimerRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionTimerEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFunctionResult> = async (routes, event, message, context) => {
    debug(context.requestId, 'Timer processing started', {});

    for (const { handler, triggerId } of routes) {
        const matched = validateTriggerId(context, triggerId, message);

        debug(context.requestId, 'Timer matching completed', { message, matched, triggerId: triggerId ?? '' });

        if (matched) {
            const result = handler(event, context, message);
            if (result instanceof Promise) {
                debug(context.requestId, 'Timer processed', {});
                return result;
            } else {
                debug(context.requestId, 'Timer processed', {});
                return Promise.resolve(result);
            }
        }
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { timerRouter };
