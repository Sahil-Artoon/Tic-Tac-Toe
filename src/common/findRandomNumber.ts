const findRandomNumber = () => {
    let numberOfCell = Math.floor(Math.random() * 9) + 1;
    return numberOfCell;
}

export { findRandomNumber }