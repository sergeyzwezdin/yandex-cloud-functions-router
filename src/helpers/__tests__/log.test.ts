import { consoleSpy } from '../../__helpers__/consoleSpy';
import { log } from '../log';

describe('log', () => {
    let consoleMock: {
        log: jest.SpyInstance;
        info: jest.SpyInstance;
        warn: jest.SpyInstance;
        error: jest.SpyInstance;
        mockRestore: () => void;
    };

    beforeEach(() => {
        consoleMock = consoleSpy();
    });

    afterEach(() => {
        consoleMock.mockRestore();
    });

    it('writes info message', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: '1',
            Param2: 2
        };

        // Act
        log('INFO', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: 1 Param2: 2`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes info entry without message', () => {
        // Arrange
        const requestId = '1';
        const message = '';
        const params = {
            Param1: '1',
            Param2: 2
        };

        // Act
        log('INFO', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Param1: 1 Param2: 2`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes info entry with null params', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: undefined
        };

        // Act
        // @ts-ignore
        log('INFO', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes info entry with number param', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: 1
        };

        // Act
        log('INFO', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: 1`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes info entry with object param', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: { x: 7, y: 42 }
        };

        // Act
        log('INFO', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: {"x":7,"y":42}`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes warn message', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: '1',
            Param2: 2
        };

        // Act
        log('WARN', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: 1 Message Param1: 1 Param2: 2`]]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });

    it('writes error message', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: '1',
            Param2: 2
        };

        // Act
        log('ERROR', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([[`[ROUTER] ERROR RequestID: 1 Message Param1: 1 Param2: 2`]]);
    });

    it('skips message with unknown type', () => {
        // Arrange
        const requestId = '1';
        const message = 'Message';
        const params = {
            Param1: '1',
            Param2: 2
        };

        // Act
        // @ts-ignore
        log('UNKNOWN', requestId, message, params);

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);
    });
});
