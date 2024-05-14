"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRejoinData = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRejoinData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        tableId: joi_1.default.string().required(),
        userData: joi_1.default.object({
            userId: joi_1.default.string().required(),
            userName: joi_1.default.string().required(),
            isActive: joi_1.default.boolean().required(),
            symbol: joi_1.default.string().required(),
            _id: joi_1.default.string().required()
        }).required()
    });
    const validationResult = schema.validate(data);
    return validationResult;
});
exports.validateRejoinData = validateRejoinData;
