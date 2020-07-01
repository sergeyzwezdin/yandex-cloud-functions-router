import {
    InvalidRequestError,
    NoMatchedRouteError,
    TriggerRouteError,
    UnknownEventTypeRouteError,
    UnknownMessageTypeRouteError
} from './routerError';

import { CloudFuntionResult } from './cloudFunctionResult';
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
        notFound?: (error: NoMatchedRouteError) => CloudFuntionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFuntionResult;
    };
    timer?: {
        notFound?: (error: NoMatchedRouteError) => CloudFuntionResult;
    };
    messageQueue?: {
        notFound?: (error: NoMatchedRouteError) => CloudFuntionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFuntionResult;
    };
    objectStorage?: {
        notFound?: (error: NoMatchedRouteError) => CloudFuntionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFuntionResult;
    };
    iot?: {
        notFound?: (error: NoMatchedRouteError) => CloudFuntionResult;
        invalidRequest?: (error: InvalidRequestError) => CloudFuntionResult;
    };
    unknownEvent?: (error: UnknownEventTypeRouteError) => CloudFuntionResult;
    unknownMessage?: (error: UnknownMessageTypeRouteError) => CloudFuntionResult;
    triggerCombinedError?: (error: TriggerRouteError) => CloudFuntionResult;
    custom?: {
        error: string | RegExp;
        result: (error: Error) => CloudFuntionResult;
    }[];
};

type RouterOptions = {
    cors?: RouterCorsOptions;
    errorHandling?: ErrorHandlingOptions;
};

export { RouterOptions, RouterCorsOptions, ErrorHandlingOptions };
