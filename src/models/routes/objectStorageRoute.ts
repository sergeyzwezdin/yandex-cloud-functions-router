import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from '../cloudFunctionEvent';

import { CloudFunctionContext } from '../cloudFunctionContext';
import { CloudFunctionResult } from '../cloudFunctionResult';

type ObjectStorageRoute = {
    type?: ObjectStorageRouteTypeValidate[];
    bucketId?: string[];
    objectId?: string[];
    handler: (
        event: CloudFunctionTriggerEvent,
        context: CloudFunctionContext,
        message: CloudFunctionObjectStorageEventMessage
    ) => CloudFunctionResult | Promise<CloudFunctionResult>;
};

type ObjectStorageRouteTypeValidate = 'create' | 'update' | 'delete';

export { ObjectStorageRoute, ObjectStorageRouteTypeValidate };
