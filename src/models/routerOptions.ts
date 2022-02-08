import {
    InvalidRequestError,
    NoMatchedRouteError,
    TriggerRouteError,
    UnknownEventTypeRouteError,
    UnknownMessageTypeRouteError
} from './routerError';

import { CloudFunctionResult } from './cloudFunctionResult';
import { HttpMethod } from './httpMethod';

type RouterCorsOptions = {
    enable: boolean;
    allowedOrigins?: string[];
    allowedMethods?: HttpMethod[];
    allowedHeaders?: string[];
    allowCredentials?: boolean;
};

type ErrorHandlingOptions = {
    http?: {
        notFound?: (error: NoMatchedRouteError) => CloudFunctionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFunctionResult;
    };
    timer?: {
        notFound?: (error: NoMatchedRouteError) => CloudFunctionResult;
    };
    messageQueue?: {
        notFound?: (error: NoMatchedRouteError) => CloudFunctionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFunctionResult;
    };
    objectStorage?: {
        notFound?: (error: NoMatchedRouteError) => CloudFunctionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFunctionResult;
    };
    iot?: {
        notFound?: (error: NoMatchedRouteError) => CloudFunctionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFunctionResult;
    };
    unknownEvent?: (error: UnknownEventTypeRouteError) => CloudFunctionResult;
    unknownMessage?: (error: UnknownMessageTypeRouteError) => CloudFunctionResult;
    triggerCombinedError?: (error: TriggerRouteError) => CloudFunctionResult;
    custom?: {
        error: string | RegExp;
        result: (error: Error) => CloudFunctionResult;
    }[];
};

type RouterOptions = {
    cors?: RouterCorsOptions;
    errorHandling?: ErrorHandlingOptions;
};

export { RouterOptions, RouterCorsOptions, ErrorHandlingOptions };
