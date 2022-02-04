import { CloudFunctionIotMessageEventMessage, CloudFunctionTriggerEvent } from '../models/cloudFunctionEvent';
import { debug, log } from '../helpers/log';

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionResult } from '../models/cloudFunctionResult';
import { IoTMessageRoute } from '../models/routes';
import { NoMatchedRouteError } from '../models/routerError';

const validateRegistryId = (
    context: CloudFunctionContext,
    registryIds: string[] | undefined,
    message: CloudFunctionIotMessageEventMessage
) => {
    if (registryIds) {
        const result = registryIds.some((registryId) => registryId === message.details.registry_id);
        debug(context.requestId, `Validating reugistry id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.registry_id,
            route: registryIds
        });

        return result;
    } else {
        return true;
    }
};

const validateDeviceId = (context: CloudFunctionContext, deviceIds: string[] | undefined, message: CloudFunctionIotMessageEventMessage) => {
    if (deviceIds) {
        const result = deviceIds.some((deviceId) => deviceId === message.details.device_id);
        debug(context.requestId, `Validating device id: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.device_id,
            route: deviceIds
        });

        return result;
    } else {
        return true;
    }
};

const validateMqttTopic = (
    context: CloudFunctionContext,
    mqttTopics: string[] | undefined,
    message: CloudFunctionIotMessageEventMessage
) => {
    if (mqttTopics) {
        const result = mqttTopics.some((mqttTopic) => mqttTopic === message.details.mqtt_topic);
        debug(context.requestId, `Validating MQTT topic: ${result ? 'valid' : 'invalid'}`, {
            request: message.details.mqtt_topic,
            route: mqttTopics
        });

        return result;
    } else {
        return true;
    }
};

const iotMessageRouter: (
    routes: IoTMessageRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionIotMessageEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFunctionResult> = async (routes, event, message, context) => {
    debug(context.requestId, 'IoT Core processing started', {});

    for (const { registryId, deviceId, mqttTopic, handler } of routes) {
        const matched =
            validateRegistryId(context, registryId, message) &&
            validateDeviceId(context, deviceId, message) &&
            validateMqttTopic(context, mqttTopic, message);

        debug(context.requestId, 'IoT Core matching completed', {
            matched,
            message,
            registryId: registryId ?? '',
            deviceId: deviceId ?? '',
            mqttTopic: mqttTopic ?? ''
        });

        if (matched) {
            const result = handler(event, context, message);
            debug(context.requestId, 'IoT Core processed', {});

            return result instanceof Promise ? result : Promise.resolve(result);
        }
    }

    log('WARN', context.requestId, 'There is no matched route', {});
    throw new NoMatchedRouteError('There is no matched route.');
};

export { iotMessageRouter };
