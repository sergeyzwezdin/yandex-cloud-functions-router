import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFuntionResult } from '../cloudFunctionResult';

type ObjectStorageRoute = {
    type?: ObjectStorageRouteTypeValidate;
    bucketId?: string;
    objectId?: string;
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionObjectStorageEventMessage
    ) => CloudFuntionResult | Promise<CloudFuntionResult>;
};

type ObjectStorageRouteTypeValidate = 'create' | 'update' | 'delete';

export { ObjectStorageRoute, ObjectStorageRouteTypeValidate };
