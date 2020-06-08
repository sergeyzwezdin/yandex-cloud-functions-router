import { CloudFunctionHttpEvent } from '../../../models/cloudFunctionEvent';
import { CloudFuntionResult } from '../../../models/cloudFunctionResult';
import { RouterCorsOptions } from '../../../models/routerOptions';
import { getHeaderValue } from '../getHeaderValue';
import { isOriginValid } from './isOriginValid';
import { isRequestMeetCorsRules } from './isRequestMeetCorsRules';
import { isRequestSimple } from './isRequestSimple';

/**
 * Append CORS headers to the main response if CORS enabled.
 */
const appendCorsHeadersToMainResponse: (
    request: CloudFunctionHttpEvent,
    response: CloudFuntionResult,
    corsOptions: RouterCorsOptions
) => CloudFuntionResult = (request, response, corsOptions) => {
    if (response && corsOptions.enable) {
        const currentOrigin = getHeaderValue(request, 'origin');

        if (currentOrigin && isOriginValid(corsOptions, currentOrigin)) {
            if (isRequestSimple(request) || isRequestMeetCorsRules(request, corsOptions)) {
                const isCookieSet = Boolean(getHeaderValue(request, 'cookie'));
                return {
                    ...response,
                    headers: {
                        ...(response.headers ?? {}),
                        'Access-Control-Allow-Origin': currentOrigin,
                        ...(corsOptions.allowCredentials === true && isCookieSet ? { 'Access-Control-Allow-Credentials': 'true' } : {})
                    }
                } as CloudFuntionResult;
            }
        }
    }

    return response;
};

export { appendCorsHeadersToMainResponse };
