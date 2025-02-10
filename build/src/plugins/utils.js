"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = void 0;
const sanitizeInput = (str) => {
    return str.replaceAll("'", "''");
};
exports.sanitizeInput = sanitizeInput;
