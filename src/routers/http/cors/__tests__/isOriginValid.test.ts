import { RouterCorsOptions } from '../../../../models/routerOptions';
import { isOriginValid } from '../isOriginValid';

describe('isOriginValid', () => {
    it('returns false for undefined origin', () => {
        // Arrange
        const options = 'http://localhost:5000';
        const origin = undefined;

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeFalsy();
    });

    it('checks RouterCorsOptions object options', () => {
        // Arrange
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:3000', 'http://Localhost:5000']
        };
        const origin = 'HTTP://localhost:5000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeTruthy();
    });

    it('checks RouterCorsOptions object options and fails', () => {
        // Arrange
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:3000', 'http://Localhost:5000']
        };
        const origin = 'HTTP://localhost:6000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeFalsy();
    });

    it('checks RouterCorsOptions object options with empty array options', () => {
        // Arrange
        const options: RouterCorsOptions = {
            enable: true
        };
        const origin = 'HTTP://localhost:5000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeFalsy();
    });

    it('checks array options', () => {
        // Arrange
        const options = ['http://localhost:3000', 'http://Localhost:5000'];
        const origin = 'HTTP://localhost:5000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeTruthy();
    });

    it('checks array options and fails', () => {
        // Arrange
        const options = ['http://localhost:3000', 'http://Localhost:5000'];
        const origin = 'HTTP://localhost:6000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeFalsy();
    });

    it('checks array options with undefined', () => {
        // Arrange
        const options = [undefined, 'http://localhost:3000', 'http://Localhost:5000'];
        const origin = 'HTTP://localhost:5000';

        // Act
        // @ts-ignore
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeTruthy();
    });

    it('checks string options', () => {
        // Arrange
        const options = 'http://Localhost:5000';
        const origin = 'HTTP://localhost:5000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeTruthy();
    });

    it('checks string options and fails', () => {
        // Arrange
        const options = 'http://Localhost:5000';
        const origin = 'HTTP://localhost:6000';

        // Act
        const result = isOriginValid(options, origin);

        // Assert
        expect(result).toBeFalsy();
    });
});
