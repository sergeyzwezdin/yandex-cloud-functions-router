import { CloudFunctionEvent, CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';

describe('router', () => {
    describe('timer', () => {
        const defaultEvent: CloudFunctionEvent = {
            messages: [
                {
                    event_metadata: {
                        event_id: 'b3c1dtdass1b2lqq2ab3',
                        event_type: 'yandex.cloud.events.serverless.triggers.TimerMessage',
                        created_at: new Date('2020-06-06T10:00:00Z'),
                        cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                        folder_id: 'd5k3ghuuk35k13w1n49t'
                    },
                    details: {
                        trigger_id: 'b4wt2lnqwvjwnregbqbb'
                    }
                }
            ]
        };

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
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionTimerEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                timer: [
                    {
                        handler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent
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

        test('handles request by trigger ID', async () => {
            // Arrange
            const defaultHandler = jest.fn(
                (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionTimerEventMessage) => ({
                    statusCode: 200
                })
            );
            const timerHandler = jest.fn(
                async (event: CloudFunctionTriggerEvent, context: CloudFunctionContext, message: CloudFunctionTimerEventMessage) => ({
                    statusCode: 200
                })
            );
            const route = router({
                timer: [
                    {
                        triggerId: 'a4wt2lnqwvjwnregbqbb',
                        handler: defaultHandler
                    },
                    {
                        triggerId: 'b4wt2lnqwvjwnregbqbb',
                        handler: timerHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent
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
            expect(timerHandler).toBeCalledTimes(1);
        });

        test('throws an error when no routes matched', async () => {
            // Arrange
            const route = router({
                timer: [
                    {
                        triggerId: 'a4wt2lnqwvjwnregbqbb',
                        handler: () => ({
                            statusCode: 200
                        })
                    },
                    {
                        triggerId: 'c4wt2lnqwvjwnregbqbb',
                        handler: () => ({
                            statusCode: 200
                        })
                    }
                ]
            });
            const event: CloudFunctionEvent = {
                ...defaultEvent
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
