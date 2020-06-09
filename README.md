# yandex-cloud-functions-router ![Build](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/workflows/Build/badge.svg) ![](https://img.shields.io/npm/v/yandex-cloud-functions-router)
`yandex-cloud-functions-router` is a Node router for [Yandex Cloud Function platform](https://cloud.yandex.com/docs/functions/). It inspired by [aws-lambda-router](https://github.com/spring-media/aws-lambda-router) and simplifies the development of serverless applications for Yandex Cloud.

* Provides **an easy way to create Node-based handlers** either for HTTP invocations and standard triggers.
* Supports **almost all supported triggers** such as [Timer trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/timer), [Message Queue trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/ymq-trigger), [Object Storage trigger](https://cloud.yandex.com/docs/functions/concepts/trigger/os-trigger), and others.
* Handles **CORS** for HTTP requests.
* **Can filter requests** by HTTP method, params, body, queue identifier, and other trigger-specific params.
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

### HTTP requests

### Timer trigger

### Message Queue trigger

### Object Storage trigger

### IoT Core trigger

## License

yandex-cloud-functions-router is released under the [MIT License](https://github.com/sergeyzwezdin/yandex-cloud-functions-router/blob/master/LICENSE).
