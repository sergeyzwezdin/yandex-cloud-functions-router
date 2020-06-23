import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFunctionHttpEvent } from '../events/httpEvent';
import { CloudFuntionResult } from '../cloudFunctionResult';
import { HttpMethod } from '../../models/httpMethod';

type HttpRoute = {
    httpMethod?: HttpMethod[];
    params?: HttpRouteParamValidate;
    body?: HttpRouteBodyPatternValidate;
    validators?: CustomHttpValidator[];
    decodeBase64Body?: boolean;
    handler: (event: CloudFunctionHttpEvent, context: CloudFunctionContext) => CloudFuntionResult | Promise<CloudFuntionResult>;
};

type HttpRouteParamValidateType = 'exact' | 'substring' | 'regexp';

type HttpRouteParamValidate = {
    [name: string]: {
        type: HttpRouteParamValidateType;
        value?: string;
        pattern?: RegExp;
    };
};

type HttpRouteBodyPatternValidate = {
    json?: object;
};

type CustomHttpValidator = (event: CloudFunctionHttpEvent, context: CloudFunctionContext) => boolean;

export { HttpRoute, HttpRouteParamValidateType, HttpRouteParamValidate, HttpRouteBodyPatternValidate, CustomHttpValidator };
