import { matchObjectPattern } from '../matchObjectPattern';

describe('matchObjectPattern', () => {
    it('matches object', () => {
        // Arrange
        const data = {
            type: 'add',
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: 'add'
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeTruthy();
    });

    it('matches object (deep)', () => {
        // Arrange
        const data = {
            type: {
                kind: {
                    z: 25
                }
            },
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: {
                kind: {
                    z: 25
                }
            }
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeTruthy();
    });

    it('matches object by 2 params', () => {
        // Arrange
        const data = {
            type: 'add',
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: 'add',
            value: {
                data: 'qwerty'
            }
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeTruthy();
    });

    test(`doesn't match object because of different data`, () => {
        // Arrange
        const data = {
            type: 'add',
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: 'update'
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeFalsy();
    });

    test(`doesn't match object because of missing property`, () => {
        // Arrange
        const data = {
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: 'update'
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeFalsy();
    });

    test(`doesn't match object because of missing property (deep)`, () => {
        // Arrange
        const data = {
            type: {
                x: 5
            },
            index: 5,
            value: {
                data: 'qwerty'
            }
        };
        const pattern = {
            type: {
                kind: {
                    y: 10
                }
            }
        };

        // Act
        const result = matchObjectPattern(data, pattern);

        // Assert
        expect(result).toBeFalsy();
    });
});
