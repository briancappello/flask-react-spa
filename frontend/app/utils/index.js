/**
 * Utility functions
 */

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

export function getUTCTimestamp() {
    // seconds since unix epoch
    return Math.floor( new Date().getTime() / 1000 );
}
