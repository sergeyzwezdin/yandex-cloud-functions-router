import { CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';
import { eventContext, timerEvent } from './../__data__/router.data';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';

describe('router', () => {
    describe('timer', () => {
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
            const event = timerEvent({ triggerId: 'b4wt2lnqwvjwnregbqbb' });
            const context = eventContext();

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
            const event = timerEvent({ triggerId: 'b4wt2lnqwvjwnregbqbb' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(timerHandler).toBeCalledTimes(1);
        });

        test('throws an error when no routes defined', async () => {
            // Arrange
            const route = router({});
            const event = timerEvent({ triggerId: 'b4wt2lnqwvjwnregbqbb' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
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
            const event = timerEvent({ triggerId: 'b4wt2lnqwvjwnregbqbb' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
        });
    });
});
