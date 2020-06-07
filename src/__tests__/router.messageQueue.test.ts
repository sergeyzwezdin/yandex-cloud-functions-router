jest.mock('./../helpers/matchObjectPattern');

import { CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';
import { eventContext, messageQueueEvent } from './../__data__/router.data';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { consoleSpy } from './../__helpers__/consoleSpy';
import { matchObjectPattern } from './../helpers/matchObjectPattern';
import { mocked } from 'ts-jest/utils';
import { router } from './../router';

describe('router', () => {
    describe('message queue', () => {
        test('handles any request', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const handler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        handler
                    }
                ]
            });
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(handler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by queue ID', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const queueHandler = jest.fn(
                async (
                    event: CloudFunctionTriggerEvent,
                    context: CloudFunctionContext,
                    message: CloudFunctionMessageQueueEventMessage
                ) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        queueId: 'a4wt2lnqwvjwnregbqbb',
                        handler: defaultHandler
                    },
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        handler: queueHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(queueHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by body (json)', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const queueHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            json: {
                                type: 'update'
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            json: {
                                type: 'add'
                            }
                        },
                        handler: queueHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(queueHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);

            consoleMock.mockRestore();
        });

        test('skips request by body (json) because of malformed JSON in body', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const handler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        handler,
                        body: {
                            json: {
                                type: 'update'
                            }
                        }
                    }
                ]
            });
            const event = messageQueueEvent({
                body: `{ type: 'add'`
            });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });

        test('handles request by body (regexp)', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const queueHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            pattern: /update/i
                        },
                        handler: defaultHandler
                    },
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            pattern: /add/i
                        },
                        handler: queueHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(queueHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);

            consoleMock.mockRestore();
        });

        test('skips request because of empty body (regexp)', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const handler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionMessageQueueEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                message_queue: [
                    {
                        handler,
                        body: {
                            pattern: /add/i
                        }
                    }
                ]
            });
            const event = messageQueueEvent({ body: '' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });

        test('throws an error on unexpected error while validate body', async () => {
            // Arrange
            mocked(matchObjectPattern).mockImplementationOnce((a: object, b: object) => {
                throw new Error('Unexpected error.');
            });
            const consoleMock = consoleSpy();
            const route = router({
                message_queue: [
                    {
                        body: {
                            json: {}
                        },
                        handler: () => ({
                            statusCode: 200
                        })
                    }
                ]
            });
            const event = messageQueueEvent({ body: JSON.stringify({ type: 'add' }) });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('Unexpected error.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);

            consoleMock.mockRestore();
            mocked(matchObjectPattern).mockReset();
        });

        test('throws an error when no routes defined', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const route = router({});
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });

        test('throws an error when no routes matched', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const route = router({
                message_queue: [
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            pattern: /update/i
                        },
                        handler: () => ({
                            statusCode: 200
                        })
                    },
                    {
                        queueId: 'b4wt2lnqwvjwnregbqbb',
                        body: {
                            json: {
                                type: 'update'
                            }
                        },
                        handler: () => ({
                            statusCode: 200
                        })
                    },
                    {
                        queueId: 'a4wt2lnqwvjwnregbqbb',
                        body: {
                            json: {
                                type: 'add'
                            }
                        },
                        handler: () => ({
                            statusCode: 200
                        })
                    }
                ]
            });
            const event = messageQueueEvent();
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} Processing message queue message Queue Id: b4wt2lnqwvjwnregbqbb`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });
    });
});
