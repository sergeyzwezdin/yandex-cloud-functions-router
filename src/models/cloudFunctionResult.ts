type CloudFuntionResult =
    | {
          statusCode: number;
          headers?: { [name: string]: string };
          multiValueHeaders?: { [name: string]: string };
          body?: string;
          isBase64Encoded?: boolean;
      }
    | undefined;

export { CloudFuntionResult };
