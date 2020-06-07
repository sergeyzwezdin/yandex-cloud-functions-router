const log = (
    level: 'INFO' | 'WARN' | 'ERROR',
    requestId: string,
    message: string,
    params: { [name: string]: string | number | object }
) => {
    const logger = level === 'INFO' ? console.info : level === 'WARN' ? console.warn : level === 'ERROR' ? console.error : undefined;

    if (logger) {
        logger(
            `[ROUTER] ${level} RequestID: ${requestId} ${[
                message,
                ...Object.entries(params).map(([name, value]) =>
                    value !== undefined && value !== null && value !== ''
                        ? `${name}: ${typeof value === 'object' ? JSON.stringify(value).replace(/[\r\n]+/g, '') : value}`
                        : undefined
                )
            ]
                .filter(Boolean)
                .join(' ')
                .trim()}`
        );
    }
};

export { log };
