import { CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../cloudFunctionContext';
import { CloudFuntionResult } from './../cloudFunctionResult';

type TimerRoute = {
    triggerId?: string;
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionTimerEventMessage
    ) => CloudFuntionResult | Promise<CloudFuntionResult>;
};

export { TimerRoute };
