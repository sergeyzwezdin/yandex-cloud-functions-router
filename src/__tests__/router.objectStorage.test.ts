import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';
import { eventContext, objectStorageEvent } from './../__data__/router.data';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';

describe('router', () => {
    describe('object storage', () => {
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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectCreate',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectCreate',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectUpdate',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectDelete',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectDelete',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectDelete',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectCreate',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

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
            const event = objectStorageEvent({
                eventType: 'yandex.cloud.events.storage.ObjectCreate',
                bucketId: 's3',
                objectId: '1.jpg'
            });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
        });
    });
});
