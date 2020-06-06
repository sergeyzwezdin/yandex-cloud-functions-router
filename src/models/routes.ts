import { HttpRoute } from './routes/httpRoute';
import { MessageQueueRoute } from './routes/messageQueueRoute';
import { TimerRoute } from './routes/timerRoute';

type Routes = {
    http?: HttpRoute[];
    timer?: TimerRoute[];
    message_queue?: MessageQueueRoute[];
    object_storage?: {}[];
    iot_message?: {}[];
};

export * from './routes/httpRoute';
export * from './routes/timerRoute';
export * from './routes/messageQueueRoute';
export { Routes };
