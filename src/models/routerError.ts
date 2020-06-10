class NoMatchedRouteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ERR_NO_MATCHED_ROUTE';
        Object.setPrototypeOf(this, NoMatchedRouteError.prototype);
    }
}

class UnknownEventTypeRouteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ERR_UNKNOWN_EVENT_TYPE';
        Object.setPrototypeOf(this, UnknownEventTypeRouteError.prototype);
    }
}

class UnknownMessageTypeRouteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ERR_UNKNOWN_MESSAGE_TYPE';
        Object.setPrototypeOf(this, UnknownMessageTypeRouteError.prototype);
    }
}

class HttpParamNotSupportedTypeRouteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ERR_PARAM_NOT_SUPPORTED_TYPE';
        Object.setPrototypeOf(this, HttpParamNotSupportedTypeRouteError.prototype);
    }
}

class TriggerRouteError extends Error {
    constructor(errors: Error[]) {
        super(errors.map((err) => err.toString()).join('\n'));
        this.name = 'ERR_TRIGGER';
        Object.setPrototypeOf(this, TriggerRouteError.prototype);
    }
}

export {
    NoMatchedRouteError,
    HttpParamNotSupportedTypeRouteError,
    UnknownEventTypeRouteError,
    UnknownMessageTypeRouteError,
    TriggerRouteError
};
