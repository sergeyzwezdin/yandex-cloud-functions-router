import { HttpMethod } from '../httpMethod';

type CloudFunctionHttpEvent = {
    httpMethod: HttpMethod;
    headers: { [name: string]: string };
    multiValueHeaders: { [name: string]: string };
    queryStringParameters: { [name: string]: string };
    multiValueQueryStringParameters: { [name: string]: string[] };
    requestContext: {
        identity: {
            sourceIp: string;
            userAgent: string;
        };
        httpMethod: HttpMethod;
        requestId: string;
        requestTime: string;
        requestTimeEpoch: number;
    };
    body: string;
    isBase64Encoded: boolean;
};

export { CloudFunctionHttpEvent };
