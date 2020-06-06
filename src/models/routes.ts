import { HttpRoute } from './routes/httpRoute';

type Routes = {
    http?: HttpRoute[];
    timer?: {};
    message_queue?: {}[];
    object_storage?: {}[];
    iot_message?: {}[];
};

export * from './routes/httpRoute';
export { Routes };
