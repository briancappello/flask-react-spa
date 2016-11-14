/**
 * Utility functions
 */
import jwtDecode from 'jwt-decode';

export function inArray(val, arr) {
    return arr.indexOf(val) !== -1;
}

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

export function validateToken(token) {
    try {
        return jwtDecode(token).exp > getUTCTimestamp();
    } catch (e) {
        return false;
    }
}
