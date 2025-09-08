"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.TooManyRequestsError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.EcoCashError = void 0;
exports.handleError = handleError;
class EcoCashError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "EcoCashError";
    }
}
exports.EcoCashError = EcoCashError;
class BadRequestError extends EcoCashError {
    constructor(message, details) {
        super(message, 400, details);
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends EcoCashError {
    constructor(message, details) {
        super(message, 401, details);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends EcoCashError {
    constructor(message, details) {
        super(message, 403, details);
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends EcoCashError {
    constructor(message, details) {
        super(message, 404, details);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends EcoCashError {
    constructor(message, details) {
        super(message, 409, details);
        this.name = "ConflictError";
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends EcoCashError {
    constructor(message, details) {
        super(message, 429, details);
        this.name = "TooManyRequestsError";
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class ServerError extends EcoCashError {
    constructor(message, details) {
        super(message, 500, details);
        this.name = "ServerError";
    }
}
exports.ServerError = ServerError;
function handleError(statusCode, message, details) {
    switch (statusCode) {
        case 400:
            throw new BadRequestError(message, details);
        case 401:
            throw new UnauthorizedError(message, details);
        case 403:
            throw new ForbiddenError(message, details);
        case 404:
            throw new NotFoundError(message, details);
        case 409:
            throw new ConflictError(message, details);
        case 429:
            throw new TooManyRequestsError(message, details);
        case 500:
            throw new ServerError(message, details);
        default:
            throw new EcoCashError(message, statusCode, details);
    }
}
