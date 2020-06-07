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
import { iotMessageRouter } from './routers/iotMessageRouter';
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
                    await timerRouter(routes.timer || [], event, message, context);
                } else if (isMessageQueueEventMessage(message)) {
                    await messageQueueRouter(routes.message_queue || [], event, message, context);
                } else if (isObjectStorageEventMessage(message)) {
                    await objectStorageRouter(routes.object_storage || [], event, message, context);
                } else if (isIotMessageEventMessage(message)) {
                    await iotMessageRouter(routes.iot_message || [], event, message, context);
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
            throw new Error(errors.map((err) => err.toString()).join('\n'));
        } else {
            return {
                statusCode: 200
            };
        }
    } else {
        throw new Error('Unknown event type.');
    }
};

export { router };
