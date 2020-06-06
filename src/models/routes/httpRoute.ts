import { CloudFunctionContext } from './../cloudFunctionContext';
import { CloudFunctionHttpEvent } from './../events/httpEvent';
import { CloudFuntionResult } from './../cloudFunctionResult';

type HttpRoute = {
    httpMethod?: string[];
    params?: HttpRouteParamValidate;
    body?: HttpRouteBodyPatternValidate;
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

export { HttpRoute, HttpRouteParamValidateType, HttpRouteParamValidate, HttpRouteBodyPatternValidate };
