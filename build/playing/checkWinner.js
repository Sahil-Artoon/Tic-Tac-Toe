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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWinner = void 0;
const checkWinner = (findTableForCheckWinner) => __awaiter(void 0, void 0, void 0, function* () {
    if (findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[2].symbol == "X" || //1
        findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" || //2
        findTableForCheckWinner.playingData[6].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //3
        findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" || //4
        findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" || //5
        findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //6
        findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //7
        findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" //8
    ) {
        return "X";
    }
    else if (findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" && //1
        findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && //2
        findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //3
        findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" && //4
        findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && //5
        findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //6
        findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //7
        findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" //8
    ) {
        return "TIE";
    }
    if (findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[2].symbol == "O" || //1
        findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" || //2
        findTableForCheckWinner.playingData[6].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //3
        findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" || //4
        findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" || //5
        findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //6
        findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //7
        findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" //8
    ) {
        return "O";
    }
    else if (findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" && //1
        findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && //2
        findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //3
        findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" && //4
        findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && //5
        findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //6
        findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //7
        findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" //8
    ) {
        return "TIE";
    }
});
exports.checkWinner = checkWinner;
