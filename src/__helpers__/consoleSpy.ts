/* istanbul ignore file */
/* ignore file coverage */

const consoleSpy = () => {
    const log = jest.spyOn(console, 'log');
    const info = jest.spyOn(console, 'info');
    const warn = jest.spyOn(console, 'warn');
    const error = jest.spyOn(console, 'error');
    const mockRestore = () => {
        log.mockRestore();
        info.mockRestore();
        warn.mockRestore();
        error.mockRestore();
    };

    return {
        log,
        info,
        warn,
        error,
        mockRestore
    };
};

export { consoleSpy };
