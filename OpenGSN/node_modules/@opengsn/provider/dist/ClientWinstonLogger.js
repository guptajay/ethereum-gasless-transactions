"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = __importDefault(require("loglevel"));
const winston_1 = __importDefault(require("winston"));
const Version_1 = require("@opengsn/common/dist/Version");
const format = winston_1.default.format.combine(winston_1.default.format.uncolorize(), winston_1.default.format.timestamp(), winston_1.default.format.simple());
const service = 'gsn-client';
const userIdKey = 'gsnuser';
const isBrowser = typeof window !== 'undefined';
function getOrCreateUserId() {
    let userId = window.localStorage[userIdKey];
    if (userId == null) {
        userId = `${userIdKey}${Date.now() % 1000000}`;
        window.localStorage[userIdKey] = userId;
    }
    return userId;
}
function createClientLogger(loggerConfiguration) {
    var _a;
    loggerConfiguration = loggerConfiguration !== null && loggerConfiguration !== void 0 ? loggerConfiguration : { logLevel: 'info' };
    if (loggerConfiguration.loggerUrl == null || typeof window === 'undefined' || window.localStorage == null) {
        loglevel_1.default.setLevel(loggerConfiguration.logLevel);
        return loglevel_1.default;
    }
    const url = new URL(loggerConfiguration.loggerUrl);
    const host = url.host;
    const path = url.pathname;
    const ssl = url.protocol === 'https:';
    const headers = { 'content-type': 'text/plain' };
    const httpTransportOptions = {
        ssl,
        format,
        host,
        path,
        headers
    };
    const transports = [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.Http(httpTransportOptions)
    ];
    let userId;
    if (loggerConfiguration.userId != null) {
        userId = loggerConfiguration.userId;
    }
    else {
        userId = getOrCreateUserId();
    }
    const localhostRegExp = /http:\/\/(localhost)|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    let applicationId = loggerConfiguration.applicationId;
    if (loggerConfiguration.applicationId == null && ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) != null && window.location.href.match(localhostRegExp) == null) {
        applicationId = window.location.href;
    }
    const logger = winston_1.default.createLogger({
        level: loggerConfiguration.logLevel,
        defaultMeta: {
            version: Version_1.gsnRuntimeVersion,
            service,
            isBrowser,
            applicationId,
            userId
        },
        transports
    });
    logger.debug(`Created remote logs collecting logger for userId: ${userId} and applicationId: ${applicationId}`);
    if (applicationId == null) {
        logger.warn('application ID is not set!');
    }
    return logger;
}
exports.createClientLogger = createClientLogger;
//# sourceMappingURL=ClientWinstonLogger.js.map