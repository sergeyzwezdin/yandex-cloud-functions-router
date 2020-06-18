# yandex-cloud-functions-router ![Build](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/workflows/Build/badge.svg) ![](https://img.shields.io/npm/v/yandex-cloud-functions-router)
`yandex-cloud-functions-router` is a Node router for [Yandex Cloud Function platform](https://cloud.yandex.com/docs/functions/). It inspired by [aws-lambda-router](https://github.com/spring-media/aws-lambda-router) and simplifies the development of serverless applications for Yandex Cloud.

* Provides **an easy way to create Node-based handlers** either for HTTP invocations and standard triggers.
* Supports **almost all supported triggers** such as [Timer trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/timer), [Message Queue trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/ymq-trigger), [Object Storage trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/os-trigger), and others.
* Handles **CORS** for HTTP requests.
* **Can filter requests** by HTTP method, params, body, queue identifier, and other trigger-specific params.
* **Customizable error mapping** to appropriate responses.
* Zero external dependencies.
* Supports **Typescript out of the box**. 🤘

## How it works

Once you create a Node application that uses this package, you can assign some routes to the handlers. Next, you publish the Yandex Cloud Functions application and it will handle every request with the corresponding handler.

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['GET'],
        handler: (event, context) => {
          // Handle HTTP request
          return {
            statusCode: 200,
            body: 'Hello from Yandex Cloud Functions'
          };
        }
      },
      {
        httpMethod: ['POST'],
        handler: (event, context) => {
          // Handle HTTP request
          return {
            statusCode: 200,
            body: 'Hello again'
          };
        }
      }
    ],
    message_queue: [
      {
        queueId: 'a4wt2lnqwvjwnregbqbb',
        handler: (event, context, message) => {
          // Handle Message Queue item
        }
      }
    ]
  });
```

Examples:
* [Typescript project](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/tree/master/examples/typescript)
* [Javascript project](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/tree/master/examples/javascript)

## Requirements

* Node 12+

## Usage

1. Install the package using npm:
```bash
$ npm install yandex-cloud-functions-router
```

2. Create router handler and export it from the main module (for example, in `index.js`):
```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({ /* ... */ });
```

3. Create a new Yandex Cloud Function in [the developer console](https://console.cloud.yandex.com/). Use `nodejs12`/`nodejs12-preview` as a runtime environment. Also, don't forget to specify `Entrypoint` for the function.

![yf-create](https://user-images.githubusercontent.com/800755/84101085-a744bb00-aa26-11ea-9ff4-3b80affca6c7.png)

4. Now the function is able to handle requests 🎉

## HTTP requests

Mark the function as `public` to be able to make HTTP requests. Once it's done, you can access it by provided URL.

![yf-http](https://user-images.githubusercontent.com/800755/84103789-7b790380-aa2d-11ea-9341-17f86a5b8bff.png)

To handle incoming HTTP requests, add `http` key into the routes definition. `httpMethod` and `handler` params are mandatory for every route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['GET'],           /* Filter by HTTP method (required). */
        params: { },                   /* Filter by Query String params (optional). */
        body: { },                     /* Filter by body content (optional). */
        validators: { },               /* Additional validator(s) for the event. */
        handler: (event, context) => { /* Handler function (required). */
          // Handle HTTP GET request

          return {
            statusCode: 200
          };
        }
      },
      {
        httpMethod: ['POST'],
        handler: (event, context) => {
          // Handle HTTP POST request

          return {
            statusCode: 200
          };
        }
      }
    ]
  });
```

`handler` accepts two params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/function-invoke). The result that function returns passed directly to Yandex Cloud, so please use [Yandex Cloud Function response format](https://cloud.yandex.com/docs/functions/concepts/function-invoke#response).

It is possible to filter requests by HTTP method, query params, and body content.

### Filtering by HTTP method

To filter requests by HTTP method, specify `httpMethod` property for a route. It's an array of HTTP methods that the current handle can process. It is a **required** property.


<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['GET'],
        handler: (event, context) => {
          // Handle HTTP GET request

          return {
            statusCode: 200
          };
        }
      },
      {
        httpMethod: ['POST'],
        handler: (event, context) => {
          // Handle HTTP POST request

          return {
            statusCode: 200
          };
        }
      },
      {
        httpMethod: ['PUT'],
        handler: (event, context) => {
          // Handle HTTP PUT request

          return {
            statusCode: 200
          };
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by Query String params

To filter requests by Query String params, specify `params` property for a route. It's a key-value dictionary (key is param name).

There are few ways how to hanlde these params - by exact match, substring, or regular expression.

It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['GET'],
        params: {
            type: {
                type: 'exact',
                value: 'get'
            }
        },
        handler: (event, context) => {
          // Handle /?type=get requests

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
                value: 'qwerty'
            }
        },
        handler: (event, context) => {
          // Handle requests where "type" param contains "qwerty"

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
                pattern: /[0-9]+/i
            }
        },
        handler: (event, context) => {
          // Handle requests where "type" param contains numbers

          return {
            statusCode: 200
          };
        }
      },
      {
        httpMethod: ['GET'],
        params: {
            type: {
                type: 'exact',
                value: 'find'
            },
            context: {
                type: 'exact',
                value: '1'
            }
        },
        handler: (event, context) => {
          // Handle /?type=find&context=1 requests

          return {
            statusCode: 200
          };
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by Body content

To filter requests by Body content, specify `body` property for a route. For the moment, only JSON content is supported. So to use the filter the request must contain `Content-Type: application/json` header and body should contain valid JSON object. If these criteria aren't met, the route will be ignored. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['POST'],
        body: {
            'type': 'add'
        },
        handler: (event, context) => {
          // Handle requests with the following body content
          // { "type": "add", ... }

          return {
            statusCode: 200
          };
        }
      },
      {
        httpMethod: ['POST'],
        body: {
            'type': 'update'
        },
        handler: (event, context) => {
          // Handle requests with the following body content
          // { "type": "update", ... }

          return {
            statusCode: 200
          };
        }
      }
    ]
  });
```

</p>
</details>

### Validators

Validators supposed to validate the event's content. In contrast to filtering, the route won't be skipped if the validator fails. Instead, exception will be thrown (and could be handled as a final HTTP 400 error). It is useful to use validators, when you're sure that it's the right route, but want to ensure that incoming request contains the correct data. For instance, if an incoming request doesn't contain the required field, it will fail.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['POST'],
        validators: [
          (event, context) => {
              if (/* check something in the event */) {
                  return true;
              }

              return false;
          }
        ],
        handler: (event, context) => {
          // Here you are sure that the request contains the correct data

          return {
            statusCode: 200
          };
        }
      }
    ]
  });
```

</p>
</details>

### CORS

To handle [CORS requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) add second param to the `router` function:


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [
      {
        httpMethod: ['POST'],
        handler: (event, context) => {
          return {
            statusCode: 200
          };
        }
      }
    ]
  },
  {
    cors: {
      enable: true,                               /* Whether CORS support is enabled (required). */
      allowedOrigins: ['http://localhost:5000'],  /* Origins that allowed to request the function (optional). */
      allowedMethods: ['GET', 'POST', 'PUT'],     /* Allowed methods that will be put into Access-Control-Allow-Methods (optional). */
      allowedHeaders: ['X-Test'],                 /* Allowed custom headers that will be put into Access-Control-Allow-Headers (optional). */
      allowCredentials: true                      /* Whether to add Access-Control-Allow-Credentials to the response (optional). */
    }
  );
```

## Timer trigger

To handle Timer trigger events, add the `timer` key into the routes definition. The only `handler` param is mandatory for the route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    timer: [
      {
        triggerId: ['a4wt2lnqwvjwnregbqbb'],     /* Filter by trigger identifier (optional). */
        handler: (event, context, message) => {  /* Handler function (required). */
          // Handle Timer trigger event
        }
      }
    ]
  });
```

`handler` accepts three params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/trigger/timer#timer-format).

It is possible to filter events by trigger ID.

### Filtering by Trigger ID

To filter events by Trigger ID, specify `triggerId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    timer: [
      {
        triggerId: ['a4wt2lnqwvjwnregbqbb'],
        handler: (event, context, message) => {
          // Handle Timer trigger event
          // for a4wt2lnqwvjwnregbqbb timer
        }
      },
      {
        triggerId: ['b4wt2lnqwvjwnregbqbb'],
        handler: (event, context, message) => {
          // Handle Timer trigger event
          // for b4wt2lnqwvjwnregbqbb timer
        }
      },
    ]
  });
```

</p>
</details>

## Message Queue trigger

To handle Message Queue trigger events, add the `message_queue` key into the routes definition. The only `handler` param is mandatory for the route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    message_queue: [
      {
        queueId: ['a4wt2lnqwvjwnregbqbb'],       /* Filter by queue identifier (optional). */
        body: { },                               /* Filter by body content (optional). */
        validators: { },                         /* Additional validator(s) for the event. */
        handler: (event, context, message) => {  /* Handler function (required). */
          // Handle Message Queue trigger event
        }
      }
    ]
  });
```

`handler` accepts three params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/trigger/ymq-trigger#ymq-format).

It is possible to filter events by queue ID or body content.

### Filtering by Queue ID

To filter events by Queue ID, specify `queueId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    message_queue: [
      {
        queueId: ['a4wt2lnqwvjwnregbqbb'],
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // for a4wt2lnqwvjwnregbqbb queue
        }
      },
      {
        queueId: ['b4wt2lnqwvjwnregbqbb'],
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // for b4wt2lnqwvjwnregbqbb queue
        }
      }
    ]
  });
```

</p>
</details>


### Filtering by Body content

To filter events by Body content, specify `body` property for a route. You can filter by JSON object properties **or** regular expression.

To use JSON filtering the request must contain `Content-Type: application/json` header and body should contain valid JSON object. If these criteria aren't met, the route will be ignored.

It is an **optional** property.

<details>
<summary>Example (JSON filter)</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    message_queue: [
      {
        body: {
            json: {
                type: 'add'
            }
        },
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // that has JSON object in body with type=add property.
        }
      },
      {
        body: {
            json: {
                type: 'update'
            }
        },
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // that has JSON object in body with type=update property.
        }
      }
    ]
  });
```

</p>
</details>


<details>
<summary>Example (RegExp filter)</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    message_queue: [
      {
        body: {
            pattern: /add/i
        },
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // whose body contains "add" word
        }
      },
      {
        body: {
            pattern: /update/i
        },
        handler: (event, context, message) => {
          // Handle Message Queue trigger event
          // whose body contains "update" word
        }
      }
    ]
  });
```

</p>
</details>


### Validators

Validators supposed to validate the event's content. In contrast to filtering, the route won't be skipped if the validator fails. Instead, exception will be thrown. It is useful to use validators, when you're sure that it's the right route, but want to ensure that incoming request contains the correct data. For instance, if an incoming request doesn't contain the required field, it will fail.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    message_queue: [
      {
        validators: [
          (event, context) => {
              if (/* check something in the event */) {
                  return true;
              }

              return false;
          }
        ],
        handler: (event, context, message) => {
          // Here you are sure that the request contains the correct data
        }
      }
    ]
  });
```

</p>
</details>

## Object Storage trigger

To handle Object Storage trigger events, add the `object_storage` key into the routes definition. The only `handler` param is mandatory for the route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    object_storage: [
      {
        type: ['create'],                        /* Filter by operation type (optional). */
        bucketId: ['s3'],                        /* Filter by bucket identifier (optional). */
        objectId: ['1.jpg'],                     /* Filter by object identifier (optional). */
        handler: (event, context, message) => {  /* Handler function (required). */
          // Handle Object Storage trigger event
        }
      }
    ]
  });
```

`handler` accepts three params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/trigger/os-trigger#ymq-format).

It is possible to filter events by type, bucket identifier, and object identifier.

### Filtering by Type

To filter events by type, specify `type` property for a route. Possible values for this filter are `create`, `update`, or `delete`. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    object_storage: [
      {
        type: ['create'],
        handler: (event, context, message) => {
          // Handle creating new object in Object Storage
        }
      },
      {
        type: ['update'],
        handler: (event, context, message) => {
          // Handle updating new object in Object Storage
        }
      },
      {
        type: ['delete'],
        handler: (event, context, message) => {
          // Handle deleting new object in Object Storage
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by Bucket ID

To filter events by bucket identifier, specify `bucketId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    object_storage: [
      {
        bucketId: ['s3'],
        handler: (event, context, message) => {
          // Handle event in "s3" bucket
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by Object ID

To filter events by object identifier, specify `objectId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    object_storage: [
      {
        objectId: ['1.jpg'],
        handler: (event, context, message) => {
          // Handle event in "1.jpg" object
        }
      }
    ]
  });
```

</p>
</details>

## IoT Core trigger

To handle IoT Core message trigger events, add the `iot_message` key into the routes definition. The only `handler` param is mandatory for the route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    iot_message: [
      {
        registryId: ['arenou2oj4ct42eq8g3n'],               /* Filter by Registry ID (optional). */
        deviceId: ['areqjd6un3afc3cefcvm'],                 /* Filter by Device ID (optional). */
        mqttTopic: ['$devices/areqjd6un3afc3cefcvm/events'],/* Filter by MQTT Topic (optional). */
        handler: (event, context, message) => {             /* Handler function (required). */
          // Handle IoT Core message trigger event
        }
      }
    ]
  });
```

`handler` accepts three params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/trigger/iot-core-trigger#iot-format).

It is possible to filter events by registry identifier, device identifier, and MQTT topic.

### Filtering by Registry ID

To filter events by the registry, specify `registryId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    iot_message: [
      {
        registryId: ['arenou2oj4ct42eq8g3n'],
        handler: (event, context, message) => {
          // Handle IoT Core message trigger event
          // for arenou2oj4ct42eq8g3n registry
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by Device ID

To filter events by the device, specify `deviceId` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    iot_message: [
      {
        deviceId: ['areqjd6un3afc3cefcvm'],
        handler: (event, context, message) => {
          // Handle IoT Core message trigger event
          // for areqjd6un3afc3cefcvm device
        }
      }
    ]
  });
```

</p>
</details>

### Filtering by MQTT Topic

To filter events by MQTT topic, specify `mqttTopic` property for a route. It is an **optional** property.

<details>
<summary>Example</summary>
<p>

```typescript
import { router } from 'yandex-cloud-functions-router';
export.handler = router({
    iot_message: [
      {
        mqttTopic: ['$devices/areqjd6un3afc3cefcvm/events'],
        handler: (event, context, message) => {
          // Handle IoT Core message trigger event
          // by $devices/areqjd6un3afc3cefcvm/events topic
        }
      }
    ]
  });
```

</p>
</details>

## Error mapping

In case of any exceptions during the request processing, it is possible to map these exceptions to specific output response. To do that specify `errorHandling` property in router options. There are standard exceptions as well as custom exception handling.

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [/* ... */]
  },
  {
    errorHandling: {
      notFound: (error) => ({
          statusCode: 404
      })
    }
  });
```

The following types of standard errors are supported:

* `notFound` — throws when there are no matching route for the current request.
* `unknownEvent` — throws when the router is unable to determine the type of processed event.
* `unknownMessage` — throws when the router started to process trigger event, but unable to determine the message type.
* `triggerCombinedError` — if the function processes few messages at the time, and during the processing few exceptions are thrown, they will be combined into `TriggerRouteError` and could be handled with `triggerCombinedError`.

In addition, it is possible to handle errors that came from the handler's logic. To do that add `custom` section which is an array of definitions for error handling.

```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    http: [/* ... */]
  },
  {
    errorHandling: {
      custom: [
        {
          error: 'Something happened',
          result: (error) => ({
            statusCode: 500
          })
        },
        {
          error: /error/i,
          result: (error) => ({
            statusCode: 500
          })
        }
      ]
    }
  });
```

Every definition contains two mandatory properties - `error` and `result`.

* `error` could be either `string` and `RegExp` object that match the message of the exception.

* `result` is a handler similar to normal (non-error) handler.

You can skip to define `errorHandling` option. In this case default set of error handlers will work, that will return HTTP 404 for `notFound`, `unknownEvent`, and `unknownMessage` types.

# License

yandex-cloud-functions-router is released under the [MIT License](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/blob/master/LICENSE).
