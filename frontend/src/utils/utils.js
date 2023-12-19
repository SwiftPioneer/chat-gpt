export const chopString = (originalString, maxLength) => {
    return originalString.length > maxLength
        ? `${originalString.substring(0, maxLength)}...`
        : originalString;
};