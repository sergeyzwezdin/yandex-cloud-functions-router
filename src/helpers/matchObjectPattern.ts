const matchObjectPattern = (data: object, pattern: object) => {
    for (const [patternPropName, patternPropValue] of Object.entries(pattern)) {
        const dataEntries = Object.entries(data);
        const [, dataPropValue] = dataEntries.find(([dataPropName, dataPropValue]) => dataPropName === patternPropName) ?? [];

        if (typeof patternPropValue === 'object' || typeof dataPropValue === 'object') {
            if (typeof patternPropValue === 'object' && typeof dataPropValue === 'object') {
                if (!matchObjectPattern(dataPropValue, patternPropValue)) {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (dataPropValue !== patternPropValue) {
                return false;
            }
        }
    }

    return true;
};

export { matchObjectPattern };
