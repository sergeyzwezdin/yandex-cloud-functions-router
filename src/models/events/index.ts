import { CloudFunctionHttpEvent } from './httpEvent';
import { CloudFunctionTriggerEvent } from './triggerEvent';

type CloudFunctionEvent = CloudFunctionHttpEvent | CloudFunctionTriggerEvent;

function isHttpEvent(message: CloudFunctionEvent): message is CloudFunctionHttpEvent {
    return Boolean((message as CloudFunctionHttpEvent).httpMethod);
}

function isTriggerEvent(message: CloudFunctionEvent): message is CloudFunctionTriggerEvent {
    return Boolean((message as CloudFunctionTriggerEvent).messages);
}

export * from './httpEvent';
export * from './triggerEvent';
export { CloudFunctionEvent, isHttpEvent, isTriggerEvent };
