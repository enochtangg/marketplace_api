exports.errorName = {
    DUPLICATE_ENTRY: `DUPLICATE_ENTRY`,
    ITEM_DOES_NOT_EXIST: `ITEM_DOES_NOT_EXIST`
}

exports.errorType = {
    DUPLICATE_ENTRY: {
        message: `There already exists an instance of shopping cart in database with same owner name`,
        statusCode: 400
    },
    ITEM_DOES_NOT_EXIST: {
        message: `That itemId does not exist in the database. Please input a proper item`,
        statusCode: 400
    }
}