import { CloudFunctionHttpEvent } from '../../models/cloudFunctionEvent';

const getHeaderValue: (request: CloudFunctionHttpEvent | undefined, header: string) => string | undefined = (request, header) => {
    if (request && header) {
        if (request.headers) {
            const headerNormalizedName = header.trim().toLowerCase();
            const [, value] = Object.entries(request.headers).find(([name]) => name.trim().toLowerCase() === headerNormalizedName) || [];

            return value;
        }
    }

    return undefined;
};

export { getHeaderValue };
