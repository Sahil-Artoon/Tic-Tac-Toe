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
exports.validatePlayGameData = void 0;
const joi_1 = __importDefault(require("joi"));
const validatePlayGameData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        data: joi_1.default.string().required(),
        sign: joi_1.default.string().required(),
        tableId: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
    });
    const validationResult = schema.validate(data);
    return validationResult;
});
exports.validatePlayGameData = validatePlayGameData;
