import { CloudFunctionEvent, CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';
import { type } from 'os';

describe('router', () => {
    describe('object storage', () => {
        const defaultEvent: (
            eventType:
                | 'yandex.cloud.events.storage.ObjectCreate'
                | 'yandex.cloud.events.storage.ObjectUpdate'
                | 'yandex.cloud.events.storage.ObjectDelete',
            bucketId: string,
            objectId: string
        ) => CloudFunctionEvent = (eventType, bucketId, objectId) => ({
            messages: [
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: eventType,
                        created_at: new Date('2020-06-06T10:00:00Z'),
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t',
                        tracing_context: {
                            trace_id: 'dd52ace79c62892f',
                            span_id: '',
                            parent_span_id: ''
                        }
                    },
                    details: {
                        bucket_id: bucketId,
                        object_id: objectId
                    }
                }
            ]
        });

        const defaultContext: CloudFunctionContext = {
            awsRequestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            invokedFunctionArn: 'd4qps1ccdga5at11o21k',
            functionName: 'd4qps1ccdga5at11o21k',
            functionVersion: 'd4qps1ccdga5at11o21k',
            memoryLimitInMB: '128',
            deadlineMs: 1591412211848,
            logGroupName: 'mtxgg5vw5al4twskw1st'
        };

        test('handles any request', async () => {
            // Arrange
            const handler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        handler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectCreate', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(handler).toBeCalledTimes(1);
        });

        test('handles request by type (create)', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const typeHandler = jest.fn(
                async (
                    event: CloudFunctionTriggerEvent,
                    context: CloudFunctionContext,
                    message: CloudFunctionObjectStorageEventMessage
                ) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        type: 'update',
                        handler: defaultHandler
                    },
                    {
                        type: 'create',
                        handler: typeHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectCreate', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(typeHandler).toBeCalledTimes(1);
        });

        test('handles request by type (update)', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const typeHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        type: 'create',
                        handler: defaultHandler
                    },
                    {
                        type: 'update',
                        handler: typeHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectUpdate', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(typeHandler).toBeCalledTimes(1);
        });

        test('handles request by type (delete)', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const typeHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        type: 'create',
                        handler: defaultHandler
                    },
                    {
                        type: 'delete',
                        handler: typeHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectDelete', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(typeHandler).toBeCalledTimes(1);
        });

        test('handles request by bucket ID', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const bucketHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        bucketId: '123',
                        handler: defaultHandler
                    },
                    {
                        bucketId: 's3',
                        handler: bucketHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectDelete', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(bucketHandler).toBeCalledTimes(1);
        });

        test('handles request by object ID', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const objectHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionObjectStorageEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                object_storage: [
                    {
                        objectId: '2.jpg',
                        handler: defaultHandler
                    },
                    {
                        objectId: '1.jpg',
                        handler: objectHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectDelete', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(objectHandler).toBeCalledTimes(1);
        });

        test('throws an error when no routes defined', async () => {
            // Arrange
            const route = router({});
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectCreate', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
        });

        test('throws an error when no routes matched', async () => {
            // Arrange
            const route = router({
                object_storage: [
                    {
                        objectId: '2.jpg',
                        handler: () => ({
                            statusCode: 200
                        })
                    },
                    {
                        bucketId: '1234',
                        handler: () => ({
                            statusCode: 200
                        })
                    },
                    {
                        type: 'update',
                        handler: () => ({
                            statusCode: 200
                        })
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent('yandex.cloud.events.storage.ObjectCreate', 's3', '1.jpg')
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
        });
    });
});
