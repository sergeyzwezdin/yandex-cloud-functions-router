type CloudFunctionObjectStorageEventMessage = {
    event_metadata: {
        event_id: string;
        event_type:
            | 'yandex.cloud.events.storage.ObjectCreate'
            | 'yandex.cloud.events.storage.ObjectUpdate'
            | 'yandex.cloud.events.storage.ObjectDelete';
        created_at: Date;
        tracing_context: {
            trace_id: string;
            span_id?: string;
            parent_span_id?: string;
        };
        cloud_id: string;
        folder_id: string;
    };
    details: {
        bucket_id: string;
        object_id: string;
    };
};

export { CloudFunctionObjectStorageEventMessage };
