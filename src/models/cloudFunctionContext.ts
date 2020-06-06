type CloudFunctionContext = {
    awsRequestId: string;
    requestId: string;
    invokedFunctionArn: string;
    functionName: string;
    functionVersion: string;
    memoryLimitInMB: string;
    deadlineMs: number;
    logGroupName: string;
};

export { CloudFunctionContext };
