import { CloudFunctionIotMessageEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { eventContext, iotMessageEvent } from '../__data__/router.data';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { NoMatchedRouteError } from '../models/routerError';
import { consoleSpy } from '../__helpers__/consoleSpy';
import { router } from '../router';

describe('router', () => {
    describe('IoT Core', () => {
        let consoleMock: {
            log: jest.SpyInstance;
            info: jest.SpyInstance;
            warn: jest.SpyInstance;
            error: jest.SpyInstance;
            mockRestore: () => void;
        };

        beforeEach(() => {
            consoleMock = consoleSpy();
        });

        afterEach(() => {
            consoleMock.mockRestore();
        });

        it('handles any request', async () => {
            // Arrange
            const handler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router(
                {
                    iot_message: [
                        {
                            handler
                        }
                    ]
                },
                { errorHandling: {} }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(handler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
        });

        it('handles request by registry ID', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const registryHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router(
                {
                    iot_message: [
                        {
                            registryId: ['brenou2oj4ct42eq8g3n'],
                            handler: defaultHandler
                        },
                        {
                            registryId: ['arenou2oj4ct42eq8g3n'],
                            handler: registryHandler
                        },

                        {
                            handler: defaultHandler
                        }
                    ]
                },
                { errorHandling: {} }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(registryHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
        });

        it('handles request by device ID', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const deviceHandler = jest.fn(
                async (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router(
                {
                    iot_message: [
                        {
                            deviceId: ['breqjd6un3afc3cefcvm'],
                            handler: defaultHandler
                        },
                        {
                            deviceId: ['areqjd6un3afc3cefcvm'],
                            handler: deviceHandler
                        },

                        {
                            handler: defaultHandler
                        }
                    ]
                },
                { errorHandling: {} }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(deviceHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
        });

        it('handles request by mqtt topic', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const mqttHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionIotMessageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router(
                {
                    iot_message: [
                        {
                            mqttTopic: ['$devices/breqjd6un3afc3cefcvm/events'],
                            handler: defaultHandler
                        },
                        {
                            mqttTopic: ['$devices/areqjd6un3afc3cefcvm/events'],
                            handler: mqttHandler
                        },

                        {
                            handler: defaultHandler
                        }
                    ]
                },
                { errorHandling: {} }
            );

            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(mqttHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
        });

        it('throws an error when no routes defined', async () => {
            // Arrange
            const route = router({}, { errorHandling: {} });
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(NoMatchedRouteError);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });

        it('throws an error when no routes defined (error handling)', async () => {
            // Arrange
            const route = router(
                {},
                {
                    errorHandling: {
                        notFound: () => ({
                            statusCode: 500
                        })
                    }
                }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(500);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });

        it('throws an error when no routes matched', async () => {
            // Arrange
            const route = router(
                {
                    iot_message: [
                        {
                            registryId: ['brenou2oj4ct42eq8g3n'],
                            handler: () => ({
                                statusCode: 200
                            })
                        },
                        {
                            deviceId: ['breqjd6un3afc3cefcvm'],
                            handler: () => ({
                                statusCode: 200
                            })
                        },
                        {
                            mqttTopic: ['$devices/breqjd6un3afc3cefcvm/events'],
                            handler: () => ({
                                statusCode: 200
                            })
                        }
                    ]
                },
                { errorHandling: {} }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(NoMatchedRouteError);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });

        it('throws an error when no routes matched (error handling)', async () => {
            // Arrange
            const route = router(
                {
                    iot_message: [
                        {
                            registryId: ['brenou2oj4ct42eq8g3n'],
                            handler: () => ({
                                statusCode: 200
                            })
                        },
                        {
                            deviceId: ['breqjd6un3afc3cefcvm'],
                            handler: () => ({
                                statusCode: 200
                            })
                        },
                        {
                            mqttTopic: ['$devices/breqjd6un3afc3cefcvm/events'],
                            handler: () => ({
                                statusCode: 200
                            })
                        }
                    ]
                },
                {
                    errorHandling: {
                        notFound: () => ({
                            statusCode: 500
                        })
                    }
                }
            );
            const event = iotMessageEvent({
                registryId: 'arenou2oj4ct42eq8g3n',
                deviceId: 'areqjd6un3afc3cefcvm',
                mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
                payload: 'VGVzdCA0'
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(500);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} Processing IoT Core message Registry Id: arenou2oj4ct42eq8g3n Device Id: areqjd6un3afc3cefcvm MQTT Topic: $devices/areqjd6un3afc3cefcvm/events`
                ]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });
    });
});
