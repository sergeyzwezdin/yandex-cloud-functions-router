import { HttpMethod } from './httpMethod';

type RouterCorsOptions = {
    enable: boolean;
    allowedOrigins?: string[];
    allowedMethods?: HttpMethod[];
    allowedHeaders?: string[];
    allowCredentials?: boolean;
};

type RouterOptions = {
    cors?: RouterCorsOptions;
};

export { RouterOptions, RouterCorsOptions };
