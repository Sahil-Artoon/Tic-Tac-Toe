import { logger } from "../logger";

const checkWinner = async (findTableForCheckWinner: any) => {
    try {
        logger.info(`START FUNCTION : checkWinner :: DATA :: ${JSON.stringify(findTableForCheckWinner)}`);
        if (
            findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[2].symbol == "X" ||//1
            findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" ||//2
            findTableForCheckWinner.playingData[6].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//3
            findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" ||//4
            findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" ||//5
            findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//6
            findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" ||//7
            findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X"   //8
        ) {
            logger.info(`END : checkWinner :: DATA :: X`);
            return "X"
        }
        if (findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[2].symbol == "O" ||//1
            findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" ||//2
            findTableForCheckWinner.playingData[6].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//3
            findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" ||//4
            findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" ||//5
            findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//6
            findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" ||//7
            findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O"   //8
        ) {
            logger.info(`END : checkWinner :: DATA :: O`);
            return "O"
        }
        if (
            findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" &&//1
            findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" &&//2
            findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//3
            findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" &&//4
            findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" &&//5
            findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//6
            findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" &&//7
            findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != ""   //8
        ) {
            logger.info(`END : checkWinner :: DATA :: TIE`);
            return "TIE"
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  checkWinner :: ${findTableForCheckWinner} , ${error}`);
    }
}

export { checkWinner }