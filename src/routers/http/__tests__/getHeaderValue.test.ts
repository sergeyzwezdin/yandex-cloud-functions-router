import { CloudFunctionHttpEvent } from '../../../models/cloudFunctionEvent';
import { getHeaderValue } from '../getHeaderValue';

describe('getHeaderValue', () => {
    it('returns undefined for empty request', () => {
        // Arrange
        const request = undefined;
        const header = 'X-Test';

        // Act
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBeUndefined();
    });

    it('returns undefined for undefined headers in request', () => {
        // Arrange
        const request: CloudFunctionHttpEvent = {
            httpMethod: 'PUT',
            // @ts-ignore
            headers: undefined,
            multiValueHeaders: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            requestContext: {
                identity: {
                    sourceIp: '',
                    userAgent: ''
                },
                httpMethod: 'PUT',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false
        };
        const header = 'X-Test';

        // Act
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBeUndefined();
    });

    it('returns undefined for empty headers in request', () => {
        // Arrange
        const request: CloudFunctionHttpEvent = {
            httpMethod: 'PUT',
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
                httpMethod: 'PUT',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const header = 'X-Test';

        // Act
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBeUndefined();
    });

    it('returns undefined for empty header name', () => {
        // Arrange
        const request: CloudFunctionHttpEvent = {
            httpMethod: 'PUT',
            headers: {
                'X-Test': '1234'
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
                httpMethod: 'PUT',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/'
        };
        const header = undefined;

        // Act
        // @ts-ignore
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBeUndefined();
    });

    it('returns undefined for non-existing header', () => {
        // Arrange
        const request: CloudFunctionHttpEvent = {
            httpMethod: 'PUT',
            headers: {
                'X-Test': '1234'
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
                httpMethod: 'PUT',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/',
        };
        const header = 'X-Test2';

        // Act
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBeUndefined();
    });

    it('returns header value', () => {
        // Arrange
        const request: CloudFunctionHttpEvent = {
            httpMethod: 'PUT',
            headers: {
                'X-Test': '1234',
                'X-Test2': '5678'
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
                httpMethod: 'PUT',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0
            },
            body: '',
            isBase64Encoded: false,
            url: '/',
            path: '/',
        };
        const header = 'X-Test2';

        // Act
        const result = getHeaderValue(request, header);

        // Assert
        expect(result).toBe('5678');
    });
});
