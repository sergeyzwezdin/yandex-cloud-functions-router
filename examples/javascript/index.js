/* istanbul ignore file */
/* ignore file coverage */

import { router } from 'yandex-cloud-functions-router';

export const handler = router({
    /* HTTP requests */

    http: [
        {
            httpMethod: ['GET'],
            params: {
                type: {
                    type: 'exact',
                    value: 'add'
                }
            },
            handler: (event, context) => {
                // Handle /?type=add
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        },

        {
            httpMethod: ['GET'],
            params: {
                type: {
                    type: 'substring',
                    value: 'upd'
                }
            },
            handler: (event, context) => {
                // Handle /?type=***upd***
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        },

        {
            httpMethod: ['GET'],
            params: {
                type: {
                    type: 'regexp',
                    pattern: /x[0-9]+/i
                }
            },
            handler: (event, context) => {
                // Handle /?type=x1234
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        },

        {
            httpMethod: ['POST'],
            body: {
                json: {
                    type: 'add'
                }
            },
            handler: (event, context) => {
                // Handle POST request with body
                // that contains `type: add` property
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        },

        {
            httpMethod: ['GET', 'POST'],
            handler: (event, context) => {
                // Handle any other GET/POST requests
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        }
    ],

    /* Timers */

    timer: [
        {
            triggerId: 'a4wt2lnqwvjwnregbqbb',
            handler: (event, context, message) => {
                // Handle a4wt2lnqwvjwnregbqbb timer
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        },

        {
            handler: (event, context, message) => {
                // Handle any other timers
                console.log({ event, context });

                return {
                    statusCode: 200
                };
            }
        }
    ],

    /* Message Queue */

    message_queue: [
        {
            queueId: 'a4wt2lnqwvjwnregbqbb',
            body: {
                json: {
                    type: 'add'
                }
            },
            handler: (event, context, message) => {
                // Handle Message Queue trigger event
                // from a4wt2lnqwvjwnregbqbb queue
                // that contains JSON object in the body
                // with "type: add" property
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            queueId: 'a4wt2lnqwvjwnregbqbb',
            body: {
                pattern: /test/i
            },
            handler: (event, context, message) => {
                // Handle Message Queue trigger event
                // from a4wt2lnqwvjwnregbqbb queue
                // that contains "test" word in the body
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            handler: (event, context, message) => {
                // Handle any other Message Queue trigger event
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        }
    ],

    /* Object Storage */

    object_storage: [
        {
            type: 'create',
            bucketId: 's3',
            handler: (event, context, message) => {
                // Handle Object Storage trigger create event
                // for "s3" bucket
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            bucketId: 's3',
            handler: (event, context, message) => {
                // Handle Object Storage trigger event
                // for "s3" bucket
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            objectId: '1.jpg',
            handler: (event, context, message) => {
                // Handle Object Storage trigger event
                // for "1.jpg" object
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            handler: (event, context, message) => {
                // Handle any other Object Storage trigger events
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        }
    ],

    /* IoT Core message */

    iot_message: [
        {
            registryId: 'arenou2oj4ct42eq8g3n',
            deviceId: 'areqjd6un3afc3cefcvm',

            handler: (event, context, message) => {
                // Handle IoT Core message trigger event
                // for "arenou2oj4ct42eq8g3n" registry
                // and "areqjd6un3afc3cefcvm" device
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            registryId: 'arenou2oj4ct42eq8g3n',
            handler: (event, context, message) => {
                // Handle IoT Core message trigger event
                // for "arenou2oj4ct42eq8g3n" registry
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            deviceId: 'areqjd6un3afc3cefcvm',
            handler: (event, context, message) => {
                // Handle IoT Core message trigger event
                // for "areqjd6un3afc3cefcvm" device
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
            handler: (event, context, message) => {
                // Handle IoT Core message trigger event
                // for "$devices/areqjd6un3afc3cefcvm/events" topic
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        },

        {
            mqttTopic: '$devices/areqjd6un3afc3cefcvm/events',
            handler: (event, context, message) => {
                // Handle any ohter IoT Core message trigger events
                console.log({ event, context, message });

                return {
                    statusCode: 200
                };
            }
        }
    ]
});
