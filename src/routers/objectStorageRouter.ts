import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';
import { ObjectStorageRoute, ObjectStorageRouteTypeValidate } from './../models/routes';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { CloudFuntionResult } from './../models/cloudFunctionResult';

const validateType = (type: ObjectStorageRouteTypeValidate | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (type) {
        return (
            (type === 'create' && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectCreate') ||
            (type === 'update' && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectUpdate') ||
            (type === 'delete' && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectDelete')
        );
    } else {
        return true;
    }
};

const validateBucketId = (bucketId: string | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (bucketId) {
        return bucketId === message.details.bucket_id;
    } else {
        return true;
    }
};
const validateObjectId = (objectId: string | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (objectId) {
        return objectId === message.details.object_id;
    } else {
        return true;
    }
};

const objectStorageRouter: (
    routes: ObjectStorageRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionObjectStorageEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFuntionResult> = async (routes, event, message, context) => {
    for (const { type, bucketId, objectId, handler } of routes) {
        const matched = validateType(type, message) && validateBucketId(bucketId, message) && validateObjectId(objectId, message);

        if (matched) {
            const result = handler(event, context, message);
            if (result instanceof Promise) {
                return result;
            } else {
                return Promise.resolve(result);
            }
        }
    }

    throw new Error('There is no matched route.');
};

export { objectStorageRouter };
