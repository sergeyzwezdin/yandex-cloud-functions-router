import { CloudFunctionEvent, CloudFunctionHttpEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { router } from './../router';

describe('router', () => {
    describe('http', () => {
        const defaultEvent: CloudFunctionEvent = {
            httpMethod: 'GET',
            headers: {
                'User-Agent': 'jest'
            },
            multiValueHeaders: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {
                'User-Agent': ['jest']
            },
            requestContext: {
                identity: {
                    sourceIp: '0.0.0.0',
                    userAgent: 'jest'
                },
                httpMethod: 'GET',
                requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
                requestTime: '6/Jun/2020:02:56:40 +0000',
                requestTimeEpoch: 1591412200
            },
            body: '{}',
            isBase64Encoded: false
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'GET'
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

        test('handles GET request', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'GET'
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(getHandler).toBeCalledTimes(1);
            expect(postHandler).toBeCalledTimes(0);
        });

        test('handles POST request', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST'
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(getHandler).toBeCalledTimes(0);
            expect(postHandler).toBeCalledTimes(1);
        });

        test('handles request by exact param', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST',
                queryStringParameters: {
                    Kind: 'test'
                }
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
            expect(paramsHandler).toBeCalledTimes(1);
        });

        test('handles request by substring param', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST',
                queryStringParameters: {
                    kind: 'value+test'
                }
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
            expect(paramsHandler).toBeCalledTimes(1);
        });

        test('handles request by regex param', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST',
                queryStringParameters: {
                    kind: 'Value+Test'
                }
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
            expect(paramsHandler).toBeCalledTimes(1);
        });

        test('throws an error on invalid param type', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = route(event, context);

            // Assert
            await expect(result).rejects.toThrow(new Error('Not supported type: unknown'));
        });

        test('handles request by body pattern', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
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
            expect(bodyHandler).toBeCalledTimes(1);
        });

        test('skips request by body pattern without content-type header', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST',
                body: JSON.stringify({
                    type: 'update',
                    data: {
                        x: 1
                    }
                })
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
        });

        test('skips request by empty body pattern', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
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
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
        });

        test('skips request with body pattern with malformed JSON in body', async () => {
            // Arrange
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
            const event: CloudFunctionEvent = {
                ...defaultEvent,
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: `{"type": "update", "data":{"x":1`
            };
            const context: CloudFunctionContext = {
                ...defaultContext
            };

            // Act
            const result = await route(event, context);

            // Assert
            expect(result).toBeDefined();
            expect(result?.statusCode).toBe(200);
            expect(defaultHandler).toBeCalledTimes(1);
            expect(bodyHandler).toBeCalledTimes(0);
        });

        test('throws an error when no routes defined', async () => {
            // Arrange
            const route = router({});
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

        test('throws an error when no routes matched', async () => {
            // Arrange
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
