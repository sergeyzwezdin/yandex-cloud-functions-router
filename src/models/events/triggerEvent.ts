import { CloudFunctionTriggerEventMessage } from './triggers';

type CloudFunctionTriggerEvent = {
    messages: CloudFunctionTriggerEventMessage[];
};

export * from './triggers';
export { CloudFunctionTriggerEvent };
