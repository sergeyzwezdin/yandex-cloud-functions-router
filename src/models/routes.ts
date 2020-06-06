import { HttpRoute } from './routes/httpRoute';
import { TimerRoute } from './routes/timerRoute';

type Routes = {
    http?: HttpRoute[];
    timer?: TimerRoute[];
    message_queue?: {}[];
    object_storage?: {}[];
    iot_message?: {}[];
};

export * from './routes/httpRoute';
export * from './routes/timerRoute';
export { Routes };
