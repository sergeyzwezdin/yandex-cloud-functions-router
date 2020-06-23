jest.mock('../helpers/matchObjectPattern');

import { HttpParamNotSupportedTypeRouteError, InvalidRequestError, NoMatchedRouteError } from '../models/routerError';
import { eventContext, httpMethodEvent } from '../__data__/router.data';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionHttpEvent } from '../models/cloudFunctionEvent';
import { HttpRouteParamValidateType } from '../models/routes/httpRoute';
import { consoleSpy } from '../__helpers__/consoleSpy';
import { matchObjectPattern } from '../helpers/matchObjectPattern';
import { mocked } from 'ts-jest/utils';
import { router } from '../router';

describe('router', () => {
    describe('http', () => {
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(handler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('handles GET request', async () => {
            // Arrange
            const getHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const postHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            handler: postHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            handler: getHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(getHandler).toBeCalledTimes(1);
            expect(postHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('handles GET request with validator', async () => {
            // Arrange
            const handler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            handler,
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            validators: [(event: CloudFunctionHttpEvent, context: CloudFunctionContext) => true]
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(handler).toBeCalledTimes(1);
        });

        it('fails GET request with validator (/wo errorhandling)', async () => {
            // Arrange
            const handler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            handler,
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            validators: [(event: CloudFunctionHttpEvent, context: CloudFunctionContext) => false]
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(InvalidRequestError);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} Invalid request`]]);
        });

        it('fails GET request with validator throwing an exception', async () => {
            // Arrange
            const handler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            handler,
                            httpMethod: ['GET'],
                            validators: [
                                () => {
                                    throw new Error('Valiator error');
                                }
                            ]
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(InvalidRequestError);
            expect(consoleMock.warn.mock.calls).toEqual([
                [`[ROUTER] WARN RequestID: ${context.requestId} Validator failed with error: Error: Valiator error`],
                [`[ROUTER] WARN RequestID: ${context.requestId} Invalid request`]
            ]);
        });

        it('fails GET request with validator (/w errorhandling)', async () => {
            // Arrange
            const handler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router({
                http: [
                    {
                        handler,
                        // @ts-ignore
                        httpMethod: ['Get'], // intentionally case-insensitive method name check
                        validators: [(event: CloudFunctionHttpEvent, context: CloudFunctionContext) => false]
                    }
                ]
            });
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(400);
            }
            expect(handler).toBeCalledTimes(0);
            expect(consoleMock.warn.mock.calls).toEqual([
                [`[ROUTER] WARN RequestID: cfa8a4b4-cf6a-48e4-959d-83d876463e57 Invalid request`]
            ]);
        });

        it('handles POST request', async () => {
            // Arrange
            const getHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const postHandler = jest.fn(async (event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            decodeBase64body: true,
                            handler: postHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            handler: getHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({
                httpMethod: 'POST',
                body: 'eD10ZXN0Jnk9MTIzNA==',
                isBase64Encoded: false
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(getHandler).toBeCalledTimes(0);
            expect(postHandler).toBeCalledTimes(1);
            expect(postHandler.mock.calls[0][0].body).toBe('eD10ZXN0Jnk9MTIzNA==');
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 20 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('handles POST request with base64 encoded message', async () => {
            // Arrange
            const getHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const postHandler = jest.fn(async (event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            decodeBase64Body: true,
                            handler: postHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            handler: getHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({
                httpMethod: 'POST',
                body: 'eD10ZXN0Jnk9MTIzNA==',
                isBase64Encoded: true
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(getHandler).toBeCalledTimes(0);
            expect(postHandler).toBeCalledTimes(1);
            expect(postHandler.mock.calls[0][0].body).toBe('x=test&y=1234');
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 20 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('handles request by exact param', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            params: {
                                kind: {
                                    type: 'exact' as HttpRouteParamValidateType,
                                    value: 'test2'
                                }
                            },
                            handler: defaultHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            params: {
                                kind: {
                                    type: 'exact' as HttpRouteParamValidateType,
                                    value: 'test'
                                }
                            },
                            handler: paramsHandler
                        },
                        {
                            handler: defaultHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );

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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"Kind":"test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);
        });

        it('handles request by substring param', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            params: {
                                kind: {
                                    type: 'substring' as HttpRouteParamValidateType,
                                    value: 'test2'
                                }
                            },
                            handler: defaultHandler
                        },
                        {
                            params: {
                                kind: {
                                    type: 'substring' as HttpRouteParamValidateType,
                                    value: '' // empty values are ignored
                                }
                            },
                            handler: defaultHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            params: {
                                kind: {
                                    type: 'substring' as HttpRouteParamValidateType,
                                    value: 'test'
                                }
                            },
                            handler: paramsHandler
                        },
                        {
                            handler: defaultHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"kind":"value+test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);
        });

        it('handles request by regex param', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const paramsHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            params: {
                                kind: {
                                    type: 'regexp' as HttpRouteParamValidateType,
                                    pattern: /test2/i
                                }
                            },
                            handler: defaultHandler
                        },
                        {
                            params: {
                                kind: {
                                    type: 'regexp' as HttpRouteParamValidateType,
                                    pattern: undefined // undefined patterns are ignored
                                }
                            },
                            handler: defaultHandler
                        },
                        {
                            // @ts-ignore
                            httpMethod: ['Post'], // intentionally case-insensitive method name check
                            params: {
                                kind: {
                                    type: 'regexp' as HttpRouteParamValidateType,
                                    pattern: /test/i
                                }
                            },
                            handler: paramsHandler
                        },
                        {
                            handler: defaultHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(0);
            expect(paramsHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 0 Query: {"kind":"Value+Test"} Headers: {"User-Agent":"jest"}`
                ]
            ]);
        });

        it('throws an error on invalid param type', async () => {
            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(HttpParamNotSupportedTypeRouteError);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('throws an error on invalid param type (error handling)', async () => {
            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {
                        custom: [
                            {
                                error: /not supported type/i,
                                result: () => ({
                                    statusCode: 500
                                })
                            }
                        ]
                    }
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(500);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('handles request by body pattern', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            // @ts-ignore
                            httpMethod: ['Get'], // intentionally case-insensitive method name check
                            handler: defaultHandler
                        },
                        {
                            // @ts-ignore
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
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'content-type': 'application/json'
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(0);
            expect(bodyHandler).toBeCalledTimes(1);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","content-type":"application/json"}`
                ]
            ]);
        });

        it('skips request by body pattern without content-type header', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
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
                },
                {
                    errorHandling: {}
                }
            );
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
        });

        it('skips request by empty body pattern', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
                    http: [
                        {
                            body: {},
                            handler: bodyHandler
                        },
                        {
                            handler: defaultHandler
                        }
                    ]
                },
                {
                    errorHandling: {}
                }
            );
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);
        });

        it('skips request with body pattern with malformed JSON in body', async () => {
            // Arrange
            const defaultHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const bodyHandler = jest.fn((event: CloudFunctionHttpEvent, context: CloudFunctionContext) => ({
                statusCode: 200
            }));
            const route = router(
                {
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
                },
                {
                    errorHandling: {}
                }
            );
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
            if (result) {
                expect(result.statusCode).toBe(200);
            }
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 32 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);
        });

        it('throws an error on unexpected error while validate body', async () => {
            // Setup
            mocked(matchObjectPattern).mockImplementationOnce((a: object, b: object) => {
                throw new Error('Unexpected error.');
            });

            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {}
                }
            );
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

            // Teardown
            mocked(matchObjectPattern).mockReset();
        });

        it('throws an error on unexpected error while validate body (error handling)', async () => {
            // Setup
            mocked(matchObjectPattern).mockImplementationOnce((a: object, b: object) => {
                throw new Error('Unexpected error.');
            });

            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {
                        custom: [
                            {
                                error: 'Unexpected error.',
                                result: () => ({
                                    statusCode: 501
                                })
                            }
                        ]
                    }
                }
            );
            const event = httpMethodEvent({
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(501);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [
                    `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 2 Query: {} Headers: {"User-Agent":"jest","Content-Type":"application/json"}`
                ]
            ]);

            // Teardown
            mocked(matchObjectPattern).mockReset();
        });

        it('throws an error when no routes defined', async () => {
            // Arrange
            const route = router(
                {},
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert

            await expect(result).rejects.toThrow(NoMatchedRouteError);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
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
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(500);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });

        it('throws an error when no routes matched', async () => {
            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {}
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(NoMatchedRouteError);
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });

        it('throws an error when no routes matched (error handling)', async () => {
            // Arrange
            const route = router(
                {
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
                },
                {
                    errorHandling: {
                        notFound: () => ({
                            statusCode: 500
                        })
                    }
                }
            );
            const event = httpMethodEvent({ httpMethod: 'GET' });
            const context = eventContext();

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            if (result) {
                expect(result.statusCode).toBe(500);
            }
            expect(consoleMock.info.mock.calls).toEqual([
                [`[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest"}`]
            ]);
            expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
        });
    });
});
