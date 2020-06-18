import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { ObjectStorageRoute, ObjectStorageRouteTypeValidate } from '../models/routes';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFuntionResult } from '../models/cloudFunctionResult';
import { NoMatchedRouteError } from '../models/routerError';
import { log } from '../helpers/log';

const validateType = (types: ObjectStorageRouteTypeValidate[] | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (types) {
        return (
            (types.some((type) => type === 'create') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectCreate') ||
            (types.some((type) => type === 'update') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectUpdate') ||
            (types.some((type) => type === 'delete') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectDelete')
        );
    } else {
        return true;
    }
};

const validateBucketId = (bucketIds: string[] | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (bucketIds) {
        return bucketIds.some((bucketId) => bucketId === message.details.bucket_id);
    } else {
        return true;
    }
};
const validateObjectId = (objectIds: string[] | undefined, message: CloudFunctionObjectStorageEventMessage) => {
    if (objectIds) {
        return objectIds.some((objectId) => objectId === message.details.object_id);
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

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { objectStorageRouter };
