import { HttpRoute } from './routes/httpRoute';
import { IoTMessageRoute } from './routes/iotMessageRoute';
import { MessageQueueRoute } from './routes/messageQueueRoute';
import { ObjectStorageRoute } from './routes/objectStorageRoute';
import { TimerRoute } from './routes/timerRoute';

type Routes = {
    http?: HttpRoute[];
    timer?: TimerRoute[];
    message_queue?: MessageQueueRoute[];
    object_storage?: ObjectStorageRoute[];
    iot_message?: IoTMessageRoute[];
};

export * from './routes/httpRoute';
export * from './routes/timerRoute';
export * from './routes/messageQueueRoute';
export * from './routes/objectStorageRoute';
export * from './routes/iotMessageRoute';
export { Routes };
