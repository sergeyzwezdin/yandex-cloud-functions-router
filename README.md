# yandex-cloud-functions-router ![Build](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/workflows/Build/badge.svg) ![](https://img.shields.io/npm/v/yandex-cloud-functions-router)
`yandex-cloud-functions-router` is a Node router for [Yandex Cloud Function platform](https://cloud.yandex.com/docs/functions/). It inspired by [aws-lambda-router](https://github.com/spring-media/aws-lambda-router) and simplifies the development of serverless applications for Yandex Cloud.

* Provides **an easy way to create Node-based handlers** either for HTTP invocations and standard triggers.
* Supports **almost all supported triggers** such as [Timer trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/timer), [Message Queue trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/ymq-trigger), [Object Storage trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/os-trigger), and others.
* Handles **CORS** for HTTP requests.
* **Can filter requests** by HTTP method, params, body, queue identifier, and other trigger-specific params.
* Zero external dependencies.
* Supports **Typescript out of the box**. 🤘

# How it works

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

# Requirements

* Node 12+

# Usage

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

To filter requests by Query String params, specify `params` property for a route. It's a key-value dictionary (key is param name, value is param content). It is an **optional** property.

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
            'type': 'get'
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
            'type': 'find',
            'context': '1'
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

## Timer trigger

To handle Timer trigger events, add the `timer` key into the routes definition. The only `handler` param is mandatory for the route.


```typescript
import { router } from 'yandex-cloud-functions-router';

export.handler = router({
    timer: [
      {
        triggerId: 'a4wt2lnqwvjwnregbqbb', /* Filter by trigger identifier (optional). */
        handler: (event, context) => {     /* Handler function (required). */
          // Handle Timer trigger event
        }
      }
    ]
  });
```

`handler` accepts two params that [came from Yandex Cloud](https://cloud.yandex.com/docs/functions/concepts/function-invoke).

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
        triggerId: 'a4wt2lnqwvjwnregbqbb',
        handler: (event, context) => {
          // Handle Timer trigger event
          // for a4wt2lnqwvjwnregbqbb timer
        }
      },
      {
        triggerId: 'b4wt2lnqwvjwnregbqbb',
        handler: (event, context) => {
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

## Object Storage trigger

## IoT Core trigger

# License

yandex-cloud-functions-router is released under the [MIT License](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/blob/master/LICENSE).
