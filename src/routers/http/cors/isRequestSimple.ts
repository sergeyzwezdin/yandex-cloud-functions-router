import { CloudFunctionHttpEvent } from '../../../models/cloudFunctionEvent';

const simpleRequestAllowedMethods = ['GET', 'HEAD', 'POST'];

const simpleRequestAllowedHeaders = [
    'accept',
    'accept-language',
    'content-language',
    'content-type',
    'dpr',
    'downlink',
    'save-data',
    'viewport-width',
    'width',
    'cookie',
    'user-agent',
    'origin'
];

const simpleRequestAllowedContentTypes = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];

const isRequestSimple: (request: CloudFunctionHttpEvent) => boolean = (request) => {
    const isMethodValid = simpleRequestAllowedMethods.indexOf(request.httpMethod.toString().trim().toUpperCase()) !== -1;

    const areHeadersValid = Object.keys(request.headers)
        .map((h) => h.trim().toLowerCase())
        .every((h) => simpleRequestAllowedHeaders.indexOf(h) !== -1);

    const [, requestContentType] = Object.entries(request.headers).find(([name]) => name.trim().toLowerCase() === 'content-type') ?? [];
    const isContentTypeValid = !Boolean(requestContentType) || simpleRequestAllowedContentTypes.indexOf(requestContentType!) !== -1;

    return isMethodValid && areHeadersValid && isContentTypeValid;
};

export { isRequestSimple, simpleRequestAllowedMethods, simpleRequestAllowedHeaders, simpleRequestAllowedContentTypes };
