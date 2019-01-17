exports.errorName = {
    DUPLICATE_ENTRY: `DUPLICATE_ENTRY`,
    ITEM_DOES_NOT_EXIST: `ITEM_DOES_NOT_EXIST`,
    ITEM_DOES_NOT_EXIST_IN_CART: `ITEM_DOES_NOT_EXIST_IN_CART`
}

exports.errorType = {
    DUPLICATE_ENTRY: {
        message: `There already exists an instance of shopping cart in database with same owner name`,
        statusCode: 400
    },
    ITEM_DOES_NOT_EXIST: {
        message: `That itemId does not exist in the database. Please input a proper item`,
        statusCode: 400
    },
    ITEM_DOES_NOT_EXIST_IN_CART: {
        message: `That itemId does not exist in the cart. Please input a proper item`,
        statusCode: 400
    }
}