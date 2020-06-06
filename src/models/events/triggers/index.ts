import { CloudFunctionIotMessageEventMessage } from './iotMessageTrigger';
import { CloudFunctionMessageQueueEventMessage } from './messageQueueTrigger';
import { CloudFunctionObjectStorageEventMessage } from './objectStorageTrigger';
import { CloudFunctionTimerEventMessage } from './timerTrigger';

type CloudFunctionTriggerEventMessage =
    | CloudFunctionTimerEventMessage
    | CloudFunctionMessageQueueEventMessage
    | CloudFunctionObjectStorageEventMessage
    | CloudFunctionIotMessageEventMessage;

function isTimerEventMessage(message: CloudFunctionTriggerEventMessage): message is CloudFunctionTimerEventMessage {
    return (message as CloudFunctionTimerEventMessage).event_metadata.event_type === 'yandex.cloud.events.serverless.triggers.TimerMessage';
}

function isMessageQueueEventMessage(message: CloudFunctionTriggerEventMessage): message is CloudFunctionMessageQueueEventMessage {
    return (message as CloudFunctionMessageQueueEventMessage).event_metadata.event_type === 'yandex.cloud.events.messagequeue.QueueMessage';
}

function isObjectStorageEventMessage(message: CloudFunctionTriggerEventMessage): message is CloudFunctionObjectStorageEventMessage {
    return (
        (message as CloudFunctionObjectStorageEventMessage).event_metadata.event_type === 'yandex.cloud.events.storage.ObjectCreate' ||
        (message as CloudFunctionObjectStorageEventMessage).event_metadata.event_type === 'yandex.cloud.events.storage.ObjectUpdate' ||
        (message as CloudFunctionObjectStorageEventMessage).event_metadata.event_type === 'yandex.cloud.events.storage.ObjectDelete'
    );
}

function isIotMessageEventMessage(message: CloudFunctionTriggerEventMessage): message is CloudFunctionIotMessageEventMessage {
    return (message as CloudFunctionIotMessageEventMessage).event_metadata.event_type === 'yandex.cloud.events.iot.IoTMessage';
}

export * from './iotMessageTrigger';
export * from './messageQueueTrigger';
export * from './objectStorageTrigger';
export * from './timerTrigger';
export {
    CloudFunctionTriggerEventMessage,
    isTimerEventMessage,
    isMessageQueueEventMessage,
    isObjectStorageEventMessage,
    isIotMessageEventMessage
};
