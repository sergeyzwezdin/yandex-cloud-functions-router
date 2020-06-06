import { CloudFunctionMessageQueueEventMessage, CloudFunctionTriggerEvent } from './../cloudFunctionEvent';

import { CloudFunctionContext } from './../cloudFunctionContext';
import { CloudFuntionResult } from './../cloudFunctionResult';

type MessageQueueRoute = {
    queueId?: string;
    body?: MessageQueueRouteBodyValidate;
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionMessageQueueEventMessage
    ) => CloudFuntionResult | Promise<CloudFuntionResult>;
};

type MessageQueueRouteBodyValidate = {
    json?: object;
    pattern?: RegExp;
};

export { MessageQueueRoute };
