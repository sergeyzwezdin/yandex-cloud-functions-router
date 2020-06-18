import { CloudFunctionIotMessageEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFuntionResult } from '../cloudFunctionResult';

type IoTMessageRoute = {
    registryId?: string[];
    deviceId?: string[];
    mqttTopic?: string[];
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionIotMessageEventMessage
    ) => CloudFuntionResult | Promise<CloudFuntionResult>;
};

export { IoTMessageRoute };
