import {
    CloudFunctionEvent,
    isHttpEvent,
    isIotMessageEventMessage,
    isMessageQueueEventMessage,
    isObjectStorageEventMessage,
    isTimerEventMessage,
    isTriggerEvent
} from './models/cloudFunctionEvent';
import { ErrorHandlingOptions, RouterOptions } from './models/routerOptions';
import {
    InvalidRequestError,
    NoMatchedRouteError,
    TriggerRouteError,
    UnknownEventTypeRouteError,
    UnknownMessageTypeRouteError
} from './models/routerError';

import { CloudFunctionContext } from './models/cloudFunctionContext';
import { CloudFuntionResult } from './models/cloudFunctionResult';
import { Routes } from './models/routes';
import { httpRouter } from './routers/httpRouter';
import { iotMessageRouter } from './routers/iotMessageRouter';
import { log } from './helpers/log';
import { messageQueueRouter } from './routers/messageQueueRouter';
import { objectStorageRouter } from './routers/objectStorageRouter';
import { timerRouter } from './routers/timerRouter';

const router: (
    routes: Routes,
    options?: RouterOptions
) => (event: CloudFunctionEvent, context: CloudFunctionContext) => Promise<CloudFuntionResult> = (routes, options) => async (
    event,
    context
) => {
    const errorHandling =
        options?.errorHandling ??
        ({
            http: {
                notFound: () => ({
                    statusCode: 404
                }),
                invalidRequest: () => ({
                    statusCode: 400
                })
            }
        } as ErrorHandlingOptions);

    try {
        if (isHttpEvent(event)) {
            try {
                log('INFO', context.requestId, '', {
                    'HTTP Method': event.httpMethod,
                    'Body Length': event.body.length,
                    Query: event.queryStringParameters,
                    Headers: event.headers
                });

                return await httpRouter(routes.http || [], event, context, options);
            } catch (error) {
                if (errorHandling) {
                    if (error instanceof NoMatchedRouteError && errorHandling.http?.notFound) {
                        return errorHandling.http.notFound(error);
                    } else if (error instanceof InvalidRequestError && errorHandling.http?.invalidRequest) {
                        return errorHandling.http.invalidRequest(error);
                    }
                }

                throw error;
            }
        } else if (isTriggerEvent(event)) {
            const errors: Error[] = [];

            for (const message of event.messages) {
                try {
                    if (isTimerEventMessage(message)) {
                        try {
                            log('INFO', context.requestId, 'Processing timer trigger message', {
                                'Trigger Id': message.details.trigger_id
                            });

                            await timerRouter(routes.timer || [], event, message, context);
                        } catch (error) {
                            if (errorHandling) {
                                if (error instanceof NoMatchedRouteError && errorHandling.timer?.notFound) {
                                    return errorHandling.timer.notFound(error);
                                }
                            }

                            throw error;
                        }
                    } else if (isMessageQueueEventMessage(message)) {
                        try {
                            log('INFO', context.requestId, 'Processing message queue message', {
                                'Queue Id': message.details.queue_id
                            });

                            await messageQueueRouter(routes.message_queue || [], event, message, context);
                        } catch (error) {
                            if (errorHandling) {
                                if (error instanceof NoMatchedRouteError && errorHandling.messageQueue?.notFound) {
                                    return errorHandling.messageQueue.notFound(error);
                                } else if (error instanceof InvalidRequestError && errorHandling.messageQueue?.invalidRequest) {
                                    return errorHandling.messageQueue.invalidRequest(error);
                                }
                            }

                            throw error;
                        }
                    } else if (isObjectStorageEventMessage(message)) {
                        try {
                            log('INFO', context.requestId, 'Processing object storage message', {
                                'Bucket Id': message.details.bucket_id,
                                'Object Id': message.details.object_id
                            });

                            await objectStorageRouter(routes.object_storage || [], event, message, context);
                        } catch (error) {
                            if (errorHandling) {
                                if (error instanceof NoMatchedRouteError && errorHandling.objectStorage?.notFound) {
                                    return errorHandling.objectStorage.notFound(error);
                                } else if (error instanceof InvalidRequestError && errorHandling.objectStorage?.invalidRequest) {
                                    return errorHandling.objectStorage.invalidRequest(error);
                                }
                            }

                            throw error;
                        }
                    } else if (isIotMessageEventMessage(message)) {
                        try {
                            log('INFO', context.requestId, 'Processing IoT Core message', {
                                'Registry Id': message.details.registry_id,
                                'Device Id': message.details.device_id,
                                'MQTT Topic': message.details.mqtt_topic
                            });

                            await iotMessageRouter(routes.iot_message || [], event, message, context);
                        } catch (error) {
                            if (errorHandling) {
                                if (error instanceof NoMatchedRouteError && errorHandling.iot?.notFound) {
                                    return errorHandling.iot.notFound(error);
                                } else if (error instanceof InvalidRequestError && errorHandling.iot?.invalidRequest) {
                                    return errorHandling.iot.invalidRequest(error);
                                }
                            }

                            throw error;
                        }
                    } else {
                        log('ERROR', context.requestId, 'Unknown message type', {});

                        throw new UnknownMessageTypeRouteError('Unknown message type.');
                    }
                } catch (e) {
                    log('ERROR', context.requestId, 'Unexpected error during message processing', {
                        Error: e
                    });

                    errors.push(e);
                }
            }

            if (errors.length === 1) {
                throw errors[0];
            } else if (errors.length > 1) {
                throw new TriggerRouteError(errors);
            } else {
                return {
                    statusCode: 200
                };
            }
        } else {
            log('ERROR', context.requestId, 'Unknown event type', {});

            throw new UnknownEventTypeRouteError('Unknown event type.');
        }
    } catch (error) {
        if (errorHandling) {
            if (error instanceof UnknownEventTypeRouteError && errorHandling.unknownEvent) {
                return errorHandling.unknownEvent(error);
            } else if (error instanceof UnknownMessageTypeRouteError && errorHandling.unknownMessage) {
                return errorHandling.unknownMessage(error);
            } else if (error instanceof TriggerRouteError && errorHandling.triggerCombinedError) {
                return errorHandling.triggerCombinedError(error);
            } else if (errorHandling.custom) {
                for (const customErrorHandler of errorHandling.custom) {
                    if (customErrorHandler.error && customErrorHandler.result) {
                        if (typeof customErrorHandler.error === 'string' && error.message === customErrorHandler.error) {
                            return customErrorHandler.result(error);
                        } else if (customErrorHandler.error instanceof RegExp && customErrorHandler.error.test(error.message)) {
                            return customErrorHandler.result(error);
                        }
                    }
                }
            }
        }

        throw error;
    }
};

export { router };
