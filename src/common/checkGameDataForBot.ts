import { findRandomNumber } from "./findRandomNumber";

const checkGameDataForBot = async (data: any) => {
    if (data[0].symbol == "O" && data[1].symbol == "O" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 24")
        return 2;
    }
    else if (data[1].symbol == "O" && data[2].symbol == "O" && data[0].symbol == "") {
        console.log("checkGameDataForBot::: 25")
        return 0
    }
    else if (data[0].symbol == "O" && data[2].symbol == "O" && data[1].symbol == "") {
        console.log("checkGameDataForBot::: 26")
        return 1
    }
    else if (data[0].symbol == "O" && data[3].symbol == "O" && data[6].symbol == "") {
        console.log("checkGameDataForBot::: 27")
        return 6
    }
    else if (data[3].symbol == "O" && data[6].symbol == "O" && data[0].symbol == "") {
        console.log("checkGameDataForBot::: 28")
        return 0
    }
    else if (data[0].symbol == "O" && data[6].symbol == "O" && data[3].symbol == "") {
        console.log("checkGameDataForBot::: 29")
        return 3
    }
    else if (data[3].symbol == "O" && data[4].symbol == "O" && data[5].symbol == "") {
        console.log("checkGameDataForBot::: 30")
        return 5
    }
    else if (data[4].symbol == "O" && data[5].symbol == "O" && data[3].symbol == "") {
        console.log("checkGameDataForBot::: 31")
        return 3
    }
    else if (data[3].symbol == "O" && data[5].symbol == "O" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 32")
        return 4
    }
    else if (data[1].symbol == "O" && data[4].symbol == "O" && data[7].symbol == "") {
        console.log("checkGameDataForBot::: 33")
        return 7
    }
    else if (data[4].symbol == "O" && data[7].symbol == "O" && data[1].symbol == "") {
        console.log("checkGameDataForBot::: 34")
        return 1
    }
    else if (data[1].symbol == "O" && data[7].symbol == "O" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 35")
        return 4
    }
    else if (data[6].symbol == "O" && data[7].symbol == "O" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 36")
        return 8
    }
    else if (data[7].symbol == "O" && data[8].symbol == "O" && data[6].symbol == "") {
        console.log("checkGameDataForBot::: 37")
        return 6
    }
    else if (data[6].symbol == "O" && data[8].symbol == "O" && data[7].symbol == "") {
        console.log("checkGameDataForBot::: 38")
        return 7
    }
    else if (data[2].symbol == "O" && data[5].symbol == "O" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 39")
        return 8
    }
    else if (data[5].symbol == "O" && data[8].symbol == "O" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 40")
        return 2
    }
    else if (data[2].symbol == "O" && data[8].symbol == "O" && data[5].symbol == "") {
        console.log("checkGameDataForBot::: 41")
        return 5
    }
    else if (data[0].symbol == "O" && data[4].symbol == "O" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 42")
        return 8
    }
    else if (data[4].symbol == "O" && data[8].symbol == "O" && data[0].symbol == "") {
        console.log("checkGameDataForBot::: 43")
        return 0
    }
    else if (data[0].symbol == "O" && data[8].symbol == "O" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 44")
        return 4
    }
    else if (data[2].symbol == "O" && data[4].symbol == "O" && data[6].symbol == "") {
        console.log("checkGameDataForBot::: 45")
        return 6
    }
    else if (data[4].symbol == "O" && data[6].symbol == "O" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 46")
        return 2
    }
    else if (data[2].symbol == "O" && data[6].symbol == "O" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 47")
        return 4
    } else if (data[0].symbol == "X" && data[1].symbol == "X" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 0")
        return 2;
    }
    else if (data[1].symbol == "X" && data[2].symbol == "X" && data[0].symbol == "") {
        console.log("checkGameDataForBot :: 1")
        return 0
    }
    else if (data[0].symbol == "X" && data[2].symbol == "X" && data[1].symbol == "") {
        console.log("checkGameDataForBot::: 2")
        return 1
    }
    else if (data[0].symbol == "X" && data[3].symbol == "X" && data[6].symbol == "") {
        console.log("checkGameDataForBot :: 3")
        return 6
    }
    else if (data[3].symbol == "X" && data[6].symbol == "X" && data[0].symbol == "") {
        console.log("checkGameDataForBot :: 4")
        return 0
    }
    else if (data[0].symbol == "X" && data[6].symbol == "X" && data[3].symbol == "") {
        console.log("checkGameDataForBot::: 5")
        return 3
    }
    else if (data[3].symbol == "X" && data[4].symbol == "X" && data[5].symbol == "") {
        console.log("checkGameDataForBot::: 6")
        return 5
    }
    else if (data[4].symbol == "X" && data[5].symbol == "X" && data[3].symbol == "") {
        console.log("checkGameDataForBot::: 7")
        return 3
    }
    else if (data[3].symbol == "X" && data[5].symbol == "X" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 8")
        return 4
    }
    else if (data[1].symbol == "X" && data[4].symbol == "X" && data[7].symbol == "") {
        console.log("checkGameDataForBot::: 9")
        return 7
    }
    else if (data[4].symbol == "X" && data[7].symbol == "X" && data[1].symbol == "") {
        console.log("checkGameDataForBot::: 10")
        return 1
    }
    else if (data[1].symbol == "X" && data[7].symbol == "X" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 11")
        return 4
    }
    else if (data[6].symbol == "X" && data[7].symbol == "X" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 12")
        return 8
    }
    else if (data[7].symbol == "X" && data[8].symbol == "X" && data[6].symbol == "") {
        console.log("checkGameDataForBot::: 13")
        return 6
    }
    else if (data[6].symbol == "X" && data[8].symbol == "X" && data[7].symbol == "") {
        console.log("")
        console.log("checkGameDataForBot::: 14")
        return 7
    }
    else if (data[2].symbol == "X" && data[5].symbol == "X" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 15")
        return 8
    }
    else if (data[5].symbol == "X" && data[8].symbol == "X" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 16")
        return 2
    }
    else if (data[2].symbol == "X" && data[8].symbol == "X" && data[5].symbol == "") {
        console.log("checkGameDataForBot::: 17")
        return 5
    }
    else if (data[0].symbol == "X" && data[4].symbol == "X" && data[8].symbol == "") {
        console.log("checkGameDataForBot::: 18")
        return 8
    }
    else if (data[4].symbol == "X" && data[8].symbol == "X" && data[0].symbol == "") {
        console.log("checkGameDataForBot::: 19")
        return 0
    }
    else if (data[0].symbol == "X" && data[8].symbol == "X" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 20")
        return 4
    }
    else if (data[2].symbol == "X" && data[4].symbol == "X" && data[6].symbol == "") {
        console.log("checkGameDataForBot::: 21")
        return 6
    }
    else if (data[4].symbol == "X" && data[6].symbol == "X" && data[2].symbol == "") {
        console.log("checkGameDataForBot::: 22")
        return 2
    }
    else if (data[2].symbol == "X" && data[6].symbol == "X" && data[4].symbol == "") {
        console.log("checkGameDataForBot::: 23")
        return 4
    }
    else {
        let numberOfCell: number;
        do {
            numberOfCell = findRandomNumber()
        } while (data[numberOfCell - 1].symbol != "")
        return numberOfCell - 1
    }
}

export { checkGameDataForBot }


