import {
    CloudFunctionEvent,
    isHttpEvent,
    isIotMessageEventMessage,
    isMessageQueueEventMessage,
    isObjectStorageEventMessage,
    isTimerEventMessage,
    isTriggerEvent
} from './models/cloudFunctionEvent';

import { CloudFunctionContext } from './models/cloudFunctionContext';
import { CloudFuntionResult } from './models/cloudFunctionResult';
import { Routes } from './models/routes';
import { httpRouter } from './routers/httpRouter';
import { messageQueueRouter } from './routers/messageQueueRouter';
import { objectStorageRouter } from './routers/objectStorageRouter';
import { timerRouter } from './routers/timerRouter';

const router: (routes: Routes) => (event: CloudFunctionEvent, context: CloudFunctionContext) => Promise<CloudFuntionResult> = (
    routes
) => async (event, context) => {
    if (isHttpEvent(event)) {
        return await httpRouter(routes.http || [], event, context);
    } else if (isTriggerEvent(event)) {
        const errors: Error[] = [];
        for (const message of event.messages) {
            try {
                if (isTimerEventMessage(message)) {
                    return await timerRouter(routes.timer || [], event, message, context);
                } else if (isMessageQueueEventMessage(message)) {
                    return await messageQueueRouter(routes.message_queue || [], event, message, context);
                } else if (isObjectStorageEventMessage(message)) {
                    return await objectStorageRouter(routes.object_storage || [], event, message, context);
                } else if (isIotMessageEventMessage(message)) {
                    // handle iot message
                    /**
                     * Filter:
                     * 1. registry_id
                     * 2. device_id
                     * 3. mqtt_topic
                     * 4. payload (regex)
                     */
                    throw new Error('Not implemented.');
                } else {
                    throw new Error('Unknown message type.');
                }
            } catch (e) {
                errors.push(e);
            }
        }

        if (errors.length === 1) {
            throw errors[0];
        } else if (errors.length > 1) {
            throw new Error(errors.map((err) => err.toString()).join('\r'));
        }
    } else {
        throw new Error('Unknown event type.');
    }
};

export { router };
