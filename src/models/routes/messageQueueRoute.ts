import { CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFunctionResult } from '../cloudFunctionResult';

type MessageQueueRoute = {
    queueId?: string[];
    body?: MessageQueueRouteBodyValidate;
    validators?: CustomMessageQueueValidator[];
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionMessageQueueEventMessage
    ) => CloudFunctionResult | Promise<CloudFunctionResult>;
};

type MessageQueueRouteBodyValidate = {
    json?: object;
    pattern?: RegExp;
};

type CustomMessageQueueValidator = (
    event: CloudFunctionTriggerEvent,
    context: CloudFunctionContext,
    message: CloudFunctionMessageQueueEventMessage
) => boolean;

export { MessageQueueRoute, MessageQueueRouteBodyValidate, CustomMessageQueueValidator };
