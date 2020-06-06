type CloudFunctionTimerEventMessage = {
    event_metadata: {
        event_id: string;
        event_type: 'yandex.cloud.events.serverless.triggers.TimerMessage';
        created_at: Date;
        cloud_id: string;
        folder_id: string;
    };
    details: {
        trigger_id: string;
    };
};

export { CloudFunctionTimerEventMessage };
