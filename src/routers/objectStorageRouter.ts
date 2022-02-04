import { CloudFunctionObjectStorageEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { ObjectStorageRoute, ObjectStorageRouteTypeValidate } from '../models/routes';
import { debug, log } from '../helpers/log';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionResult } from '../models/cloudFunctionResult';
import { NoMatchedRouteError } from '../models/routerError';

const validateType = (
    context: CloudFunctionContext,
    types: ObjectStorageRouteTypeValidate[] | undefined,
    message: CloudFunctionObjectStorageEventMessage
) => {
    if (types) {
        const result =
            (types.some((type) => type === 'create') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectCreate') ||
            (types.some((type) => type === 'update') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectUpdate') ||
            (types.some((type) => type === 'delete') && message.event_metadata.event_type === 'yandex.cloud.events.storage.ObjectDelete');
        debug(context.requestId, `Validating type: ${result ? 'valid' : 'invalid'}`, {
            request: message.event_metadata.event_type,
            route: types
        });

        return result;
    } else {
        return true;
    }
};

const validateBucketId = (
    context: CloudFunctionContext,
    bucketIds: string[] | undefined,
    message: CloudFunctionObjectStorageEventMessage
) => {
    if (bucketIds) {
        const result = bucketIds.some((bucketId) => bucketId === message.details.bucket_id);
        debug(context.requestId, `Validating bucket id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.bucket_id,
            route: bucketIds
        });

        return result;
    } else {
        return true;
    }
};
const validateObjectId = (
    context: CloudFunctionContext,
    objectIds: string[] | undefined,
    message: CloudFunctionObjectStorageEventMessage
) => {
    if (objectIds) {
        const result = objectIds.some((objectId) => objectId === message.details.object_id);
        debug(context.requestId, `Validating object id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.object_id,
            route: objectIds
        });

        return result;
    } else {
        return true;
    }
};

const objectStorageRouter: (
    routes: ObjectStorageRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionObjectStorageEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFunctionResult> = async (routes, event, message, context) => {
    debug(context.requestId, 'Object storage processing started', {});

    for (const { type, bucketId, objectId, handler } of routes) {
        const matched =
            validateType(context, type, message) &&
            validateBucketId(context, bucketId, message) &&
            validateObjectId(context, objectId, message);

        debug(context.requestId, 'Object storage matching completed', {
            matched,
            message,
            type: type ?? '',
            bucketId: bucketId ?? '',
            objectId: objectId ?? ''
        });

        if (matched) {
            const result = handler(event, context, message);
            debug(context.requestId, 'Object storage processed', {});

            return result instanceof Promise ? result : Promise.resolve(result);
        }
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { objectStorageRouter };
