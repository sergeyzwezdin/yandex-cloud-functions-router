import { RouterCorsOptions } from '../../../models/routerOptions';

const normalizeOrigin: (origin?: string) => string = (origin) =>
    origin
        ? origin
              .trim()
              .toLowerCase()
              .replace(/[\\\/]+$/, '')
              .trim()
        : '';

const isOriginValid: (options: RouterCorsOptions | string[] | string, origin: string | undefined) => boolean = (options, origin) => {
    if (origin) {
        if (Array.isArray(options)) {
            const allowedOrigins = options.map(normalizeOrigin);
            return allowedOrigins.indexOf(normalizeOrigin(origin)) !== -1 || allowedOrigins.indexOf('*') !== -1;
        } else if (typeof options === 'object') {
            return isOriginValid(options.allowedOrigins || [], origin);
        } else if (typeof options === 'string') {
            return normalizeOrigin(options) === normalizeOrigin(origin);
        }
    }

    return false;
};

export { isOriginValid };
