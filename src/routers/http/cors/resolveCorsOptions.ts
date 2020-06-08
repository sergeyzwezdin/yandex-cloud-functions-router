import { RouterCorsOptions } from '../../../models/routerOptions';

const resolveCorsOptions: (options?: RouterCorsOptions) => RouterCorsOptions = (options) => {
    if (options) {
        if (options.enable === true) {
            return {
                enable: true,
                allowedOrigins: options.allowedOrigins ?? ['*'],
                allowedMethods: options.allowedMethods ?? ['GET', 'HEAD', 'POST'],
                allowedHeaders: options.allowedHeaders ?? [],
                allowCredentials: options.allowCredentials ?? true
            };
        } else {
            return { enable: false };
        }
    } else {
        return { enable: false };
    }
};

export { resolveCorsOptions };
