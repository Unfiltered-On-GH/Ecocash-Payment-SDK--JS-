export declare class EcoCashError extends Error {
    statusCode?: number | undefined;
    details?: any | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: any | undefined);
}
export declare class BadRequestError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class UnauthorizedError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class ForbiddenError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class NotFoundError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class ConflictError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class TooManyRequestsError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare class ServerError extends EcoCashError {
    constructor(message: string, details?: any);
}
export declare function handleError(statusCode: number, message: string, details?: any): never;
