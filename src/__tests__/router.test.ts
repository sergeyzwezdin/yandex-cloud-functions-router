import { TriggerRouteError, UnknownEventTypeRouteError, UnknownMessageTypeRouteError } from '../models/routerError';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionEvent } from '../models/cloudFunctionEvent';
import { router } from '../router';

describe('router', () => {
    it('throws an error for unknown event type', async () => {
        // Arrange
        const route = router({}, { errorHandling: {} });
        const event: CloudFunctionEvent = {} as CloudFunctionEvent;
        const context: CloudFunctionContext = {} as CloudFunctionContext;

        // Act
        const result = route(event, context);

        // Assert
        await expect(result).rejects.toThrow(UnknownEventTypeRouteError);
    });

    it('throws an error for unknown event type (error handling)', async () => {
        // Arrange
        const route = router(
            {},
            {
                errorHandling: {
                    unknownEvent: () => ({
                        statusCode: 501
                    })
                }
            }
        );
        const event: CloudFunctionEvent = {} as CloudFunctionEvent;
        const context: CloudFunctionContext = {} as CloudFunctionContext;

        // Act
        const result = await route(event, context);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(501);
        }
    });

    it('throws an error for unknown event type (without any options)', async () => {
        // Arrange
        const route = router({});
        const event: CloudFunctionEvent = {} as CloudFunctionEvent;
        const context: CloudFunctionContext = {} as CloudFunctionContext;

        // Act
        const result = route(event, context);

        // Assert
        await expect(result).rejects.toThrow(UnknownEventTypeRouteError);
    });

    it('throws an error for unknown message type', async () => {
        // Arrange
        const route = router({}, { errorHandling: {} });
        // @ts-ignore
        const event: CloudFunctionEvent = {
            messages: [
                {
                    event_metadata: {
                        event_type: '<wrong message type>'
                    }
                }
            ]
        } as CloudFunctionEvent;
        const context: CloudFunctionContext = {} as CloudFunctionContext;

        // Act
        const result = route(event, context);

        // Assert
        await expect(result).rejects.toThrow(UnknownMessageTypeRouteError);
    });

    it('throws an error for unknown message type (error handling)', async () => {
        // Arrange
        const route = router(
            {},
            {
                errorHandling: {
                    unknownMessage: () => ({
                        statusCode: 501
                    })
                }
            }
        );
        // @ts-ignore
        const event: CloudFunctionEvent = {
            messages: [
                {
                    event_metadata: {
                        event_type: '<wrong message type>'
                    }
                }
            ]
        } as CloudFunctionEvent;
        const context: CloudFunctionContext = {} as CloudFunctionContext;

        // Act
        const result = await route(event, context);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(501);
        }
    });

    it('throws an error that combines multiplie errors from message handlers', async () => {
        // Arrange
        const route = router(
            {
                message_queue: [
                    {
                        handler: () => {
                            throw new Error('message queue error');
                        }
                    }
                ],
                object_storage: [
                    {
                        handler: () => {
                            throw new Error('object storage error');
                        }
                    }
                ]
            },
            { errorHandling: {} }
        );
        const event: CloudFunctionEvent = {
            messages: [
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.messagequeue.QueueMessage',
                        created_at: '2020-06-06T10:00:00Z',
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t'
                    },
                    details: {
                        queue_id: 'b4wt2lnqwvjwnregbqbb',
                        message: {
                            message_id: '1cc52025-f485e7bd-32441eed-3bce2ebc',
                            md5_of_body: 'ed076287532e86365e841e92bfc50d8c',
                            body: JSON.stringify({
                                type: 'add',
                                data: 'x'
                            }),
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
                },
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.storage.ObjectCreate',
                        created_at: '2020-06-06T10:00:00Z',
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t',
                        tracing_context: {
                            trace_id: 'dd52ace79c62892f',
                            span_id: '',
                            parent_span_id: ''
                        }
                    },
                    details: {
                        bucket_id: 's3',
                        object_id: '1.jpg'
                    }
                }
            ]
        } as CloudFunctionEvent;
        const context: CloudFunctionContext = {
            awsRequestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            invokedFunctionArn: 'd4qps1ccdga5at11o21k',
            functionName: 'd4qps1ccdga5at11o21k',
            functionVersion: 'd4qps1ccdga5at11o21k',
            memoryLimitInMB: '128',
            deadlineMs: 1591412211848,
            logGroupName: 'mtxgg5vw5al4twskw1st'
        };

        // Act
        const result = route(event, context);

        // Assert
        await expect(result).rejects.toThrow(TriggerRouteError);
    });

    it('throws an error that combines multiplie errors from message handlers (error handling)', async () => {
        // Arrange
        const route = router(
            {
                message_queue: [
                    {
                        handler: () => {
                            throw new Error('message queue error');
                        }
                    }
                ],
                object_storage: [
                    {
                        handler: () => {
                            throw new Error('object storage error');
                        }
                    }
                ]
            },
            {
                errorHandling: {
                    triggerCombinedError: () => ({
                        statusCode: 501
                    })
                }
            }
        );
        const event: CloudFunctionEvent = {
            messages: [
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.messagequeue.QueueMessage',
                        created_at: '2020-06-06T10:00:00Z',
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t'
                    },
                    details: {
                        queue_id: 'b4wt2lnqwvjwnregbqbb',
                        message: {
                            message_id: '1cc52025-f485e7bd-32441eed-3bce2ebc',
                            md5_of_body: 'ed076287532e86365e841e92bfc50d8c',
                            body: JSON.stringify({
                                type: 'add',
                                data: 'x'
                            }),
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
                },
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.storage.ObjectCreate',
                        created_at: '2020-06-06T10:00:00Z',
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t',
                        tracing_context: {
                            trace_id: 'dd52ace79c62892f',
                            span_id: '',
                            parent_span_id: ''
                        }
                    },
                    details: {
                        bucket_id: 's3',
                        object_id: '1.jpg'
                    }
                }
            ]
        } as CloudFunctionEvent;
        const context: CloudFunctionContext = {
            awsRequestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
            invokedFunctionArn: 'd4qps1ccdga5at11o21k',
            functionName: 'd4qps1ccdga5at11o21k',
            functionVersion: 'd4qps1ccdga5at11o21k',
            memoryLimitInMB: '128',
            deadlineMs: 1591412211848,
            logGroupName: 'mtxgg5vw5al4twskw1st'
        };

        // Act
        const result = await route(event, context);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(501);
        }
    });
});
