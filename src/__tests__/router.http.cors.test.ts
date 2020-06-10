import { eventContext, httpMethodEvent } from '../__data__/router.data';

import { consoleSpy } from '../__helpers__/consoleSpy';
import { router } from '../router';

describe('router', () => {
    describe('http', () => {
        describe('when CORS enabled', () => {
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

            it('handles simple GET request', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('ok');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000"}`
                    ]
                ]);
            });

            it('handles simple GET request with credentials', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        Cookie: 'login=user1'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('ok');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Credentials', 'true');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Cookie":"login=user1"}`
                    ]
                ]);
            });

            it('handles simple GET request with disabled credentials', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowCredentials: false
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        Cookie: 'login=user1'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('ok');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Cookie":"login=user1"}`
                    ]
                ]);
            });

            it('handles simple HEAD request', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['HEAD'],
                                handler: () => ({ statusCode: 200 })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'HEAD',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: HEAD Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000"}`
                    ]
                ]);
            });

            it('handles simple POST request', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['POST'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('ok');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain"}`
                    ]
                ]);
            });

            it('fails for not allowed origin for simple GET request', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['POST'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:3000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Origin');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain"}`
                    ]
                ]);
            });

            it('handles * origin for simple GET request', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain"}`
                    ]
                ]);
            });

            it('handles preflight request with allowed origin', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('handles preflight request with allowed origin and credentials', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        Cookie: 'login=user1'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Credentials', 'true');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Cookie":"login=user1"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('handles preflight request with allowed origin and disabled credentials', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowCredentials: false
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        Cookie: 'login=user1'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Cookie":"login=user1"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('fails preflight request with not allowed origin', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:3000']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Origin');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('handles preflight request with allowed method', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'PUT']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'PUT'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'GET, PUT');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Access-Control-Request-Method":"PUT"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('fails preflight request with not allowed method', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'POST']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'PUT'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'GET, POST');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Access-Control-Request-Method":"PUT"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('handles preflight request with allowed custom header', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'POST'],
                            allowedHeaders: ['X-Test']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'X-Test'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'GET, POST');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'X-Test');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"X-Test"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('fails preflight request with not allowed custom header', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'POST'],
                            allowedHeaders: ['X-Test']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'X-Test2'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(204);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'GET, POST');
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'X-Test');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"X-Test2"}`
                    ],
                    [`[ROUTER] INFO RequestID: ${context.requestId} CORS preflight request handled`]
                ]);
            });

            it('handles request with allowed custom header', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['POST'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'POST'],
                            allowedHeaders: ['X-Test']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'POST',
                    headers: {
                        Accept: 'text/plain',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'X-Test': '1234'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: POST Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"text/plain","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","X-Test":"1234"}`
                    ]
                ]);
            });

            it('defined OPTIONS handler intercepts CORS', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['OPTIONS'],
                                handler: () => ({ statusCode: 200, body: 'custom OPTIONS handler' })
                            }
                        ]
                    },
                    {
                        cors: {
                            enable: true,
                            allowedOrigins: ['http://localhost:5000'],
                            allowedMethods: ['GET', 'POST'],
                            allowedHeaders: ['X-Test']
                        },
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'X-Test2'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();
                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('custom OPTIONS handler');
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Origin');
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Methods');
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Headers');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: OPTIONS Body Length: 7 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000","Content-Type":"text/plain","Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"X-Test2"}`
                    ]
                ]);
            });
        });

        describe('when CORS disabled', () => {
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

            it('skips default CORS headers for simple requests', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200, body: 'ok' })
                            }
                        ]
                    },
                    {
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000'
                    }
                });
                const context = eventContext();

                // Act
                const result = await route(event, context);

                // Assert
                expect(result).toBeDefined();

                if (result) {
                    expect(result.statusCode).toBe(200);
                    expect(result.body).toBe('ok');
                    expect(result.headers ?? {}).not.toHaveProperty('Access-Control-Allow-Origin');
                }
                expect(consoleMock.info.mock.calls).toEqual([
                    [
                        `[ROUTER] INFO RequestID: ${context.requestId} HTTP Method: GET Body Length: 0 Query: {} Headers: {"User-Agent":"jest","Accept":"application/json","Accept-Language":"en","Origin":"http://localhost:5000"}`
                    ]
                ]);
            });

            it('fails preflight CORS requests', async () => {
                // Arrange
                const route = router(
                    {
                        http: [
                            {
                                httpMethod: ['GET'],
                                handler: () => ({ statusCode: 200 })
                            }
                        ]
                    },
                    {
                        errorHandling: {}
                    }
                );
                const event = httpMethodEvent({
                    httpMethod: 'OPTIONS',
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en',
                        Origin: 'http://localhost:5000',
                        'Content-Type': 'text/plain',
                        'Access-Control-Request-Method': 'PUT'
                    },
                    body: 'request'
                });
                const context = eventContext();

                // Act
                const result = route(event, context);

                // Assert
                await expect(result).rejects.toThrow(new Error('There is no matched route.'));
                expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: ${context.requestId} There is no matched route`]]);
            });
        });
    });
});
