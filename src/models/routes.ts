import { HttpRoute } from './routes/httpRoute';
import { MessageQueueRoute } from './routes/messageQueueRoute';
import { ObjectStorageRoute } from './routes/objectStorageRoute';
import { TimerRoute } from './routes/timerRoute';

type Routes = {
    http?: HttpRoute[];
    timer?: TimerRoute[];
    message_queue?: MessageQueueRoute[];
    object_storage?: ObjectStorageRoute[];
    iot_message?: {}[];
};

export * from './routes/httpRoute';
export * from './routes/timerRoute';
export * from './routes/messageQueueRoute';
export * from './routes/objectStorageRoute';
export { Routes };
