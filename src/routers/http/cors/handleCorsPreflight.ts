import { CloudFunctionHttpEvent } from '../../../models/cloudFunctionEvent';
import { CloudFuntionResult } from '../../../models/cloudFunctionResult';
import { RouterCorsOptions } from '../../../models/routerOptions';
import { getHeaderValue } from '../getHeaderValue';
import { isOriginValid } from './isOriginValid';

const handleCorsPreflight: (event: CloudFunctionHttpEvent, options?: RouterCorsOptions) => CloudFuntionResult | undefined = (
    event,
    options
) => {
    if (event && options && options.enable) {
        const method = event.httpMethod?.toString().trim().toUpperCase();
        const currentOrigin = getHeaderValue(event, 'origin');

        if (method === 'OPTIONS') {
            if (currentOrigin && isOriginValid(options, currentOrigin)) {
                const accessControlAllowMethods = options.allowedMethods?.map((m) => m.trim().toUpperCase()).join(', ');
                const accessControlAllowHeaders = options.allowedHeaders?.map((m) => m.trim()).join(', ');
                const isCookieSet = Boolean(getHeaderValue(event, 'cookie'));

                return {
                    statusCode: 204,
                    headers: {
                        'Access-Control-Allow-Origin': currentOrigin,
                        ...(accessControlAllowMethods ? { 'Access-Control-Allow-Methods': accessControlAllowMethods } : {}),
                        ...(accessControlAllowHeaders ? { 'Access-Control-Allow-Headers': accessControlAllowHeaders } : {}),
                        ...(options.allowCredentials === true && isCookieSet ? { 'Access-Control-Allow-Credentials': 'true' } : {})
                    }
                };
            } else {
                return {
                    statusCode: 204
                };
            }
        }
    }

    return undefined;
};

export { handleCorsPreflight };
