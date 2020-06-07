const actual = jest.requireActual('./../matchObjectPattern');

actual.matchObjectPattern = jest.fn(actual.matchObjectPattern);

module.exports = actual;
