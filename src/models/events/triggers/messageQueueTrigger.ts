type CloudFunctionMessageQueueEventMessage = {
    event_metadata: {
        event_id: string;
        event_type: 'yandex.cloud.events.messagequeue.QueueMessage';
        created_at: Date;
    };
    details: {
        queue_id: string;
        message: {
            message_id: string;
            md5_of_body: string;
            body: string;
            attributes: {
                SentTimestamp: string;
            };
            message_attributes: {
                messageAttributeKey: {
                    dataType: 'StringValue' | 'BinaryValue' | 'NumberValue';
                    stringValue?: string;
                    numberValue?: number;
                    binaryValue?: string;
                };
            };
            md5_of_message_attributes: string;
        };
    };
};

export { CloudFunctionMessageQueueEventMessage };
