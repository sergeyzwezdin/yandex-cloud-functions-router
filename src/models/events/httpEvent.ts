import { HttpMethod } from '../httpMethod';

type CloudFunctionHttpEvent = {
    httpMethod: HttpMethod;
    headers: { [name: string]: string };
    params: { [name: string]: string };
    pathParams: { [name: string]: string };
    multiValueParams: { [name: string]:  string[] };
    multiValueHeaders: { [name: string]: string[] };
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
    path: string;
    url: string;
};

export { CloudFunctionHttpEvent };
