import { consoleSpy } from './../../__helpers__/consoleSpy';
import { log } from './../log';

describe('log', () => {
    test('writes info message', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('INFO', '1', 'Message', {
            Param1: '1',
            Param2: 2
        });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: 1 Param2: 2`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes info entry without message', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('INFO', '1', '', {
            Param1: '1',
            Param2: 2
        });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Param1: 1 Param2: 2`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes info entry with null params', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        // @ts-ignore
        log('INFO', '1', 'Message', { Param1: undefined });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes info entry with number param', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('INFO', '1', 'Message', { Param1: 1 });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: 1`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes info entry with object param', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('INFO', '1', 'Message', { Param1: { x: 7, y: 42 } });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([[`[ROUTER] INFO RequestID: 1 Message Param1: {"x":7,"y":42}`]]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes warn message', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('WARN', '1', 'Message', {
            Param1: '1',
            Param2: 2
        });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([[`[ROUTER] WARN RequestID: 1 Message Param1: 1 Param2: 2`]]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });

    test('writes error message', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        log('ERROR', '1', 'Message', {
            Param1: '1',
            Param2: 2
        });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([[`[ROUTER] ERROR RequestID: 1 Message Param1: 1 Param2: 2`]]);

        consoleMock.mockRestore();
    });

    test('skips message with unknown type', () => {
        // Arrange
        const consoleMock = consoleSpy();

        // Act
        // @ts-ignore
        log('UNKNOWN', '1', 'Message', {
            Param1: '1',
            Param2: 2
        });

        // Assert
        expect(consoleMock.log.mock.calls).toEqual([]);
        expect(consoleMock.info.mock.calls).toEqual([]);
        expect(consoleMock.warn.mock.calls).toEqual([]);
        expect(consoleMock.error.mock.calls).toEqual([]);

        consoleMock.mockRestore();
    });
});
