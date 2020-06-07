jest.mock('./../helpers/matchObjectPattern');

import { eventContext, httpMethodEvent } from './../__data__/router.data';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { CloudFunctionHttpEvent } from './../models/cloudFunctionEvent';
import { consoleSpy } from './../__helpers__/consoleSpy';
import { matchObjectPattern } from './../helpers/matchObjectPattern';
import { mocked } from 'ts-jest/utils';
import { router } from './../router';

describe('router', () => {
    describe('http', () => {
        test('handles any request', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const handler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        handler
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(handler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles GET request', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const getHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const postHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        handler: postHandler
                    },
                    {
                        httpMethod: ['Get'], // intentionally case-insensitive method name check
                        handler: getHandler
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(getHandler).toBeCalledTimes(1);
            expect(postHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles POST request', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const getHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const postHandler = jest.fn(async (event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        handler: postHandler
                    },
                    {
                        httpMethod: ['Get'], // intentionally case-insensitive method name check
                        handler: getHandler
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'POST' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(getHandler).toBeCalledTimes(0);
            expect(postHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by exact param', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        params: {
                            kind: {
                                type: 'exact',
                                value: 'test2'
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        params: {
                            kind: {
                                type: 'exact',
                                value: 'test'
                            }
                        },
                        handler: paramsHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });

            const event = httpMethodEvent({
                httpMethod: 'POST',
                queryStringParameters: {
                    Kind: 'test'
                }
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"Kind":"test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by substring param', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        params: {
                            kind: {
                                type: 'substring',
                                value: 'test2'
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        params: {
                            kind: {
                                type: 'substring',
                                value: '' // empty values are ignored
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        params: {
                            kind: {
                                type: 'substring',
                                value: 'test'
                            }
                        },
                        handler: paramsHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                queryStringParameters: {
                    kind: 'value+test'
                }
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"kind":"value+test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by regex param', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        params: {
                            kind: {
                                type: 'regexp',
                                pattern: /test2/i
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        params: {
                            kind: {
                                type: 'regexp',
                                pattern: undefined // undefined patterns are ignored
                            }
                        },
                        handler: defaultHandler
                    },
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        params: {
                            kind: {
                                type: 'regexp',
                                pattern: /test/i
                            }
                        },
                        handler: paramsHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                queryStringParameters: {
                    kind: 'Value+Test'
                }
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"kind":"Value+Test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('throws an error on invalid param type', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const route = router({
                http: [
                    {
                        params: {
                            kind: {
                                // @ts-ignore
                                type: 'unknown'
                            }
                        },
                        handler: () => ({ statusCode: 200 })
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('Not supported type: unknown'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);

            consoleMock.mockRestore();
        });

        test('handles request by body pattern', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        httpMethod: ['Get'], // intentionally case-insensitive method name check
                        handler: defaultHandler
                    },
                    {
                        httpMethod: ['Post'], // intentionally case-insensitive method name check
                        body: {
                            json: {
                                type: 'update'
                            }
                        },
                        handler: bodyHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'update',
                    data: {
                        x: 1
                    }
                })
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(0);
            expect(bodyHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('skips request by body pattern without content-type header', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        body: {
                            json: {
                                type: 'update'
                            }
                        },
                        handler: bodyHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                body: JSON.stringify({
                    type: 'update',
                    data: {
                        x: 1
                    }
                })
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);

            consoleMock.mockRestore();
        });

        test('skips request by empty body pattern', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        body: {},
                        handler: bodyHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'update',
                    data: {
                        x: 1
                    }
                })
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('skips request with body pattern with malformed JSON in body', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        body: {
                            json: {
                                type: 'update'
                            }
                        },
                        handler: bodyHandler
                    },
                    {
                        handler: defaultHandler
                    }
                ]
            });
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: `{"type": "update", "data":{"x":1`
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);

            consoleMock.mockRestore();
        });

        test('throws an error on unexpected error while validate body', async () => {
            // Arrange
            mocked(matchObjectPattern).mockImplementationOnce((a: object, b: object) => {
                throw new Error('Unexpected error.');
            });
            const consoleMock = consoleSpy();
            const route = router({
                http: [
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
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('Unexpected error.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 2 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);

            consoleMock.mockRestore();
            mocked(matchObjectPattern).mockReset();
        });

        test('throws an error when no routes defined', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const route = router({});
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });

        test('throws an error when no routes matched', async () => {
            // Arrange
            const consoleMock = consoleSpy();
            const route = router({
                http: [
                    {
                        params: {
                            kind: {
                                type: 'exact',
                                value: 'test'
                            }
                        },
                        handler: () => ({ statusCode: 200 })
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('There is no matched route.'));
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);

            consoleMock.mockRestore();
        });
    });
});
