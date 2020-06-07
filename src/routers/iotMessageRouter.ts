import { CloudFunctionIotMessageEventMessage, CloudFunctionTriggerEvent } from './../models/cloudFunctionEvent';

import { CloudFunctionContext } from './../models/cloudFunctionContext';
import { CloudFuntionResult } from './../models/cloudFunctionResult';
import { IoTMessageRoute } from './../models/routes';

const validateRegistryId = (registryId: string | undefined, message: CloudFunctionIotMessageEventMessage) => {
    if (registryId) {
        return registryId === message.details.registry_id;
    } else {
        return true;
    }
};

const validateDeviceId = (deviceId: string | undefined, message: CloudFunctionIotMessageEventMessage) => {
    if (deviceId) {
        return deviceId === message.details.device_id;
    } else {
        return true;
    }
};

const validateMqttTopic = (mqttTopic: string | undefined, message: CloudFunctionIotMessageEventMessage) => {
    if (mqttTopic) {
        return mqttTopic === message.details.mqtt_topic;
    } else {
        return true;
    }
};

const iotMessageRouter: (
    routes: IoTMessageRoute[],
    event: CloudFunctionTriggerEvent,
    message: CloudFunctionIotMessageEventMessage,
    context: CloudFunctionContext
) => Promise<CloudFuntionResult> = async (routes, event, message, context) => {
    for (const { registryId, deviceId, mqttTopic, handler } of routes) {
        const matched =
            validateRegistryId(registryId, message) && validateDeviceId(deviceId, message) && validateMqttTopic(mqttTopic, message);

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

export { iotMessageRouter };
