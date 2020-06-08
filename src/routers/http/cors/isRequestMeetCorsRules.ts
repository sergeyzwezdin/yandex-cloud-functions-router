import { CloudFunctionHttpEvent } from '../../../models/cloudFunctionEvent';
import { RouterCorsOptions } from '../../../models/routerOptions';
import { getHeaderValue } from '../getHeaderValue';
import { isOriginValid } from './isOriginValid';
import { simpleRequestAllowedHeaders } from './isRequestSimple';

const isRequestMeetCorsRules: (request: CloudFunctionHttpEvent, options: RouterCorsOptions) => boolean = (request, options) => {
    const method = request.httpMethod?.toString().trim().toUpperCase();
    const currentOrigin = getHeaderValue(request, 'origin');
    const allowedHeaders = [...simpleRequestAllowedHeaders, ...options.allowedHeaders!.map((h) => h.trim().toLowerCase())];

    const isMethodValid = options.allowedMethods!.map((m) => m.trim().toUpperCase()).indexOf(method) !== -1;

    const areHeadersValid = Object.keys(request.headers)
        .map((h) => h.trim().toLowerCase())
        .every((h) => allowedHeaders.indexOf(h) !== -1);

    return isMethodValid && areHeadersValid && isOriginValid(options, currentOrigin);
};

export { isRequestMeetCorsRules };
