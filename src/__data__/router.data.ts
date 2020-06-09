/* istanbul ignore file */
/* ignore file coverage */

import { CloudFunctionContext } from '../models/cloudFunctionContext';
import { CloudFunctionEvent } from '../models/cloudFunctionEvent';
import { HttpMethod } from '../models/httpMethod';

const httpMethodEvent: (data: {
    httpMethod: HttpMethod;
    headers?: { [name: string]: string };
    body?: string;
    queryStringParameters?: { [name: string]: string };
}) => CloudFunctionEvent = ({ httpMethod, headers, body, queryStringParameters }) => ({
    httpMethod,
    headers: {
        'User-Agent': 'jest',
        ...(headers || {})
    },
    multiValueHeaders: {},
    queryStringParameters: queryStringParameters || {},
    multiValueQueryStringParameters: {},
    body: body || '',
    requestContext: {
        identity: {
            sourceIp: '0.0.0.0',
            userAgent: 'jest'
        },
        httpMethod: 'GET',
        requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
        requestTime: '6/Jun/2020:02:56:40 +0000',
        requestTimeEpoch: 1591412200
    },
    isBase64Encoded: false
});

const timerEvent: (data: { triggerId: string }) => CloudFunctionEvent = ({ triggerId }) => ({
    messages: [
        {
            event_metadata: {
                event_id: 'b3c1dtdass1b2lqq2ab3',
                event_type: 'yandex.cloud.events.serverless.triggers.TimerMessage',
                created_at: new Date('2020-06-06T10:00:00Z'),
                cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                folder_id: 'd5k3ghuuk35k13w1n49t'
            },
            details: {
                trigger_id: triggerId
            }
        }
    ]
});

const messageQueueEvent: (data?: { body?: string }) => CloudFunctionEvent = ({ body } = {}) => ({
    messages: [
        {
            event_metadata: {
                event_id: 'b3c1dtdass1b2lqq2ab3',
                event_type: 'yandex.cloud.events.messagequeue.QueueMessage',
                created_at: new Date('2020-06-06T10:00:00Z'),
                cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                folder_id: 'd5k3ghuuk35k13w1n49t'
            },
            details: {
                queue_id: 'b4wt2lnqwvjwnregbqbb',
                message: {
                    message_id: '1cc52025-f485e7bd-32441eed-3bce2ebc',
                    md5_of_body: 'ed076287532e86365e841e92bfc50d8c',
                    body:
                        body === undefined
                            ? JSON.stringify({
                                  type: 'add',
                                  data: 'x'
                              })
                            : body,
                    attributes: {
                        SentTimestamp: '1566995011111'
                    },
                    message_attributes: {
                        messageAttributeKey: {
                            dataType: 'StringValue',
                            stringValue: ''
                        }
                    },
                    md5_of_message_attributes: 'ed076287532e86365e841e92bfc50d8c'
                }
            }
        }
    ]
});

const objectStorageEvent: (data: {
    eventType:
        | 'yandex.cloud.events.storage.ObjectCreate'
        | 'yandex.cloud.events.storage.ObjectUpdate'
        | 'yandex.cloud.events.storage.ObjectDelete';
    bucketId: string;
    objectId: string;
}) => CloudFunctionEvent = ({ eventType, bucketId, objectId }) => ({
    messages: [
        {
            event_metadata: {
                event_id: 'b3c1dtdass1b2lqq2ab3',
                event_type: eventType || 'yandex.cloud.events.storage.ObjectCreate',
                created_at: new Date('2020-06-06T10:00:00Z'),
                cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                folder_id: 'd5k3ghuuk35k13w1n49t',
                tracing_context: {
                    trace_id: 'dd52ace79c62892f',
                    span_id: '',
                    parent_span_id: ''
                }
            },
            details: {
                bucket_id: bucketId || 's3',
                object_id: objectId || '1.jpg'
            }
        }
    ]
});

const iotMessageEvent: (data: { registryId: string; deviceId: string; mqttTopic: string; payload?: string }) => CloudFunctionEvent = ({
    registryId,
    deviceId,
    mqttTopic,
    payload
}) => ({
    messages: [
        {
            event_metadata: {
                event_id: 'b3c1dtdass1b2lqq2ab3',
                event_type: 'yandex.cloud.events.iot.IoTMessage',
                created_at: new Date('2020-06-06T10:00:00Z'),
                cloud_id: 'a3ac5mbbt1pwvs7mc13z',
                folder_id: 'd5k3ghuuk35k13w1n49t'
            },
            details: {
                registry_id: registryId,
                device_id: deviceId,
                mqtt_topic: mqttTopic,
                payload: payload || ''
            }
        }
    ]
});

const eventContext: () => CloudFunctionContext = () => ({
    awsRequestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
    requestId: 'cfa8a4b4-cf6a-48e4-959d-83d876463e57',
    invokedFunctionArn: 'd4qps1ccdga5at11o21k',
    functionName: 'd4qps1ccdga5at11o21k',
    functionVersion: 'd4qps1ccdga5at11o21k',
    memoryLimitInMB: '128',
    deadlineMs: 1591412211848,
    logGroupName: 'mtxgg5vw5al4twskw1st'
});

export { httpMethodEvent, timerEvent, messageQueueEvent, objectStorageEvent, iotMessageEvent, eventContext };
