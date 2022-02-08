import { CloudFunctionIotMessageEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFunctionResult } from '../cloudFunctionResult';

type IoTMessageRoute = {
    registryId?: string[];
    deviceId?: string[];
    mqttTopic?: string[];
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionIotMessageEventMessage
    ) => CloudFunctionResult | Promise<CloudFunctionResult>;
};

export { IoTMessageRoute };
