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
import { log } from './helpers/log';
import { messageQueueRouter } from './routers/messageQueueRouter';
import { objectStorageRouter } from './routers/objectStorageRouter';
import { timerRouter } from './routers/timerRouter';

const router: (routes: Routes) => (event: CloudFunctionEvent, context: CloudFunctionContext) => Promise<CloudFuntionResult> = (
    routes
) => async (event, context) => {
    if (isHttpEvent(event)) {
        log('INFO', context.requestId, '', {
            'HTTP Method': event.httpMethod,
            'Body Length': event.body.length,
            Query: event.queryStringParameters,
            Headers: event.headers
        });

        return await httpRouter(routes.http || [], event, context);
    } else if (isTriggerEvent(event)) {
        const errors: Error[] = [];

        for (const message of event.messages) {
            try {
                if (isTimerEventMessage(message)) {
                    log('INFO', context.requestId, 'Processing timer trigger message', {
                        'Trigger Id': message.details.trigger_id
                    });

                    await timerRouter(routes.timer || [], event, message, context);
                } else if (isMessageQueueEventMessage(message)) {
                    log('INFO', context.requestId, 'Processing message queue message', {
                        'Queue Id': message.details.queue_id
                    });

                    await messageQueueRouter(routes.message_queue || [], event, message, context);
                } else if (isObjectStorageEventMessage(message)) {
                    log('INFO', context.requestId, 'Processing object storage message', {
                        'Bucket Id': message.details.bucket_id,
                        'Object Id': message.details.object_id
                    });

                    await objectStorageRouter(routes.object_storage || [], event, message, context);
                } else if (isIotMessageEventMessage(message)) {
                    log('INFO', context.requestId, 'Processing IoT Core message', {
                        'Registry Id': message.details.registry_id,
                        'Device Id': message.details.device_id,
                        'MQTT Topic': message.details.mqtt_topic
                    });

                    await iotMessageRouter(routes.iot_message || [], event, message, context);
                } else {
                    log('ERROR', context.requestId, 'Unknown message type', {});

                    throw new Error('Unknown message type.');
                }
            } catch (e) {
                log('ERROR', context.requestId, 'Unexcpected error during message processing', {
                    Error: e
                });

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
        log('ERROR', context.requestId, 'Unknown event type', {});

        throw new Error('Unknown event type.');
    }
};

export { router };
