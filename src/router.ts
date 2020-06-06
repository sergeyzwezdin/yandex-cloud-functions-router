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

const router: (routes: Routes) => (event: CloudFunctionEvent, context: CloudFunctionContext) => Promise<CloudFuntionResult> = (
    routes
) => async (event, context) => {
    if (isHttpEvent(event)) {
        return await httpRouter(routes.http || [], event, context);
    } else if (isTriggerEvent(event)) {
        for (const message of event.messages) {
            if (isTimerEventMessage(message)) {
                // handle timer
                throw new Error('Not implemented.');
            } else if (isMessageQueueEventMessage(message)) {
                // handle message queue
                /**
                 * Filter:
                 * 1. queue_id
                 * 2. body (regex / json)
                 */
                throw new Error('Not implemented.');
            } else if (isObjectStorageEventMessage(message)) {
                // handle object storage
                /**
                 * Filter:
                 * 1. Type:
                 *    - Create
                 *    - Update
                 *    - Delete
                 * 2. bucket_id
                 * 3. object_id
                 */
                throw new Error('Not implemented.');
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
        }
    } else {
        throw new Error('Unknown event type.');
    }
};

export { router };
