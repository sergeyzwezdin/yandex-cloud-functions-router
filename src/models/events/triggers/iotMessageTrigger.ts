type CloudFunctionIotMessageEventMessage = {
    event_metadata: {
        event_id: string;
        event_type: 'yandex.cloud.events.iot.IoTMessage';
        created_at: Date;
    };
    details: {
        registry_id: string;
        device_id: string;
        mqtt_topic: string;
        payload: string;
    };
};

export { CloudFunctionIotMessageEventMessage };
