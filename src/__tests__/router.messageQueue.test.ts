import { CloudFunctionEvent, CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';

describe('router', () => {
    describe('message queue', () => {
        const defaultEvent: (body?: string) => CloudFunctionEvent = (body) => ({
            messages: [
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.messagequeue.QueueMessage',
                        created_at: new Date('2020-06-06T10:00:00Z'),
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t'
                    },
                    details: {
                        queue_id: 'b4wt2lnqwvjwnregbqbb',
                        message: {
                            message_id: '1cc52025-f485e7bd-32441eed-3bce2ebc',
                            md5_of_body: 'ed076287532e86365e841e92bfc50d8c',
                            body:
                                body === undefined
                                    ? JSON.stringify({
                                          type: 'add',
                                          data: 'x'
                                      })
                                    : body,
                            attributes: {
                                SentTimestamp: '1566995011111'
                            },
                            message_attributes: {
                                messageAttributeKey: {
                                    dataType: 'StringValue',
                                    stringValue: ''
                                }
                            },
                            md5_of_message_attributes: 'ed076287532e86365e841e92bfc50d8c'
                        }
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
            const event: CloudFunctionEvent = {
                ...defaultEvent()
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

        test('handles request by queue ID', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent()
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
            expect(queueHandler).toBeCalledTimes(1);
        });

        test('handles request by body (json)', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent()
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
            expect(queueHandler).toBeCalledTimes(1);
        });

        test('skips request by body (json) because of malformed JSON in body', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent(`{ type: 'add'`)
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
        });

        test('handles request by body (regexp)', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent()
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
            expect(queueHandler).toBeCalledTimes(1);
        });

        test('skips request because of empty body (regexp)', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent('')
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
            const event: CloudFunctionEvent = {
                ...defaultEvent()
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
