"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const format = winston_1.default.format.combine(winston_1.default.format.cli());
function createCommandsLogger(level) {
    const transports = [
        new winston_1.default.transports.Console({ format })
    ];
    return winston_1.default.createLogger({
        level,
        transports
    });
}
exports.createCommandsLogger = createCommandsLogger;
//# sourceMappingURL=CommandsWinstonLogger.js.map