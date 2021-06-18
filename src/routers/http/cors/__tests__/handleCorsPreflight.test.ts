import { CloudFunctionHttpEvent } from '../../../../models/cloudFunctionEvent';
import { RouterCorsOptions } from '../../../../models/routerOptions';
import { handleCorsPreflight } from '../handleCorsPreflight';

describe('handleCorsPreflight', () => {
    it('skips handling when event is not defined', () => {
        // Arrange
        const event: CloudFunctionHttpEvent | undefined = undefined;
        const options: RouterCorsOptions = {
            enable: true
        };

        // Act
        // @ts-ignore
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeUndefined();
    });

    it('skips handling when options is not defined', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {},
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions | undefined = undefined;

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeUndefined();
    });

    it('skips handling when disabled', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {},
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: false
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeUndefined();
    });

    it('skips handling when method is not OPTIONS', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'POST',
            headers: {},
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'POST',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeUndefined();
    });

    it('skips handling when method is undefined', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            // @ts-ignore
            httpMethod: undefined,
            headers: {},
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'POST',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeUndefined();
    });

    it('skips handling when origin is not defined', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {},
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toBeUndefined();
        }
    });

    it('skips handling when origin is not valid', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:3000']
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toBeUndefined();
        }
    });

    it('handles request', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:5000'],
            allowCredentials: false
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Methods');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Headers');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
        }
    });

    it('handles request with allowed methods', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000',
                'Access-Control-Request-Method': 'PATCH'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:5000'],
            allowedMethods: ['PUT', 'PATCH'],
            allowCredentials: false
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
            expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'PUT, PATCH');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Headers');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
        }
    });

    it('handles request with allowed headers', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000',
                'Access-Control-Request-Headers': 'X-Test'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:5000'],
            allowedHeaders: ['X-Test', 'X-Test2'],
            allowCredentials: false
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Methods');
            expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'X-Test, X-Test2');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
        }
    });

    it('handles request without credentials', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:5000'],
            allowCredentials: true
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Methods');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Headers');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
        }
    });

    it('handles request with credentials', () => {
        // Arrange
        const event: CloudFunctionHttpEvent = {
            httpMethod: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:5000',
                Cookie: 'login=user1'
            },
            multiValueHeaders: {},
            multiValueParams: {},
            params: {},
            pathParams: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'OPTIONS',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:5000'],
            allowCredentials: true
        };

        // Act
        const result = handleCorsPreflight(event, options);

        // Assert
        expect(result).toBeDefined();
        if (result) {
            expect(result.statusCode).toBe(204);
            expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', 'http://localhost:5000');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Methods');
            expect(result.headers).not.toHaveProperty('Access-Control-Allow-Headers');
            expect(result.headers).toHaveProperty('Access-Control-Allow-Credentials', 'true');
        }
    });
});
