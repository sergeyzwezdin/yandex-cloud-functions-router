import { CloudFunctionTimerEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFunctionResult } from '../cloudFunctionResult';

type TimerRoute = {
    triggerId?: string[];
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionTimerEventMessage
    ) => CloudFunctionResult | Promise<CloudFunctionResult>;
};

export { TimerRoute };
