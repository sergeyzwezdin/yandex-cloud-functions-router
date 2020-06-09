import { RouterCorsOptions } from '../../../../models/routerOptions';
import { resolveCorsOptions } from '../resolveCorsOptions';

describe('resolveCorsOptions', () => {
    it('returns CORS disabled when options undefined', () => {
        // Arrange
        const options = undefined;

        // Act
        const result = resolveCorsOptions(options);

        // Assert
        expect(result).toBeDefined();
        expect(result.enable).toBeFalsy();
        expect(result.allowedOrigins).toBeUndefined();
        expect(result.allowedMethods).toBeUndefined();
        expect(result.allowedHeaders).toBeUndefined();
        expect(result.allowCredentials).toBeUndefined();
    });

    it('returns CORS disabled when it disabled in options', () => {
        // Arrange
        const options = { enable: false };

        // Act
        const result = resolveCorsOptions(options);

        // Assert
        expect(result).toBeDefined();
        expect(result.enable).toBeFalsy();
        expect(result.allowedOrigins).toBeUndefined();
        expect(result.allowedMethods).toBeUndefined();
        expect(result.allowedHeaders).toBeUndefined();
        expect(result.allowCredentials).toBeUndefined();
    });

    it('returns CORS enabled with default settings', () => {
        // Arrange
        const options = { enable: true };

        // Act
        const result = resolveCorsOptions(options);

        // Assert
        expect(result).toBeDefined();
        expect(result.enable).toBeTruthy();
        expect(result.allowedOrigins).toEqual(['*']);
        expect(result.allowedMethods).toEqual(['GET', 'HEAD', 'POST']);
        expect(result.allowedHeaders).toEqual([]);
        expect(result.allowCredentials).toBeTruthy();
    });

    it('returns CORS enabled with defined settings', () => {
        // Arrange
        const options: RouterCorsOptions = {
            enable: true,
            allowedOrigins: ['http://localhost:3000', 'http://localhost:5000'],
            allowedMethods: ['GET', 'POST', 'PATCH'],
            allowedHeaders: ['X-Test1', 'X-Test2'],
            allowCredentials: true
        };

        // Act
        const result = resolveCorsOptions(options);

        // Assert
        expect(result).toBeDefined();
        expect(result.enable).toBeTruthy();
        expect(result.allowedOrigins).toEqual(['http://localhost:3000', 'http://localhost:5000']);
        expect(result.allowedMethods).toEqual(['GET', 'POST', 'PATCH']);
        expect(result.allowedHeaders).toEqual(['X-Test1', 'X-Test2']);
        expect(result.allowCredentials).toBeTruthy();
    });
});
