exports.errorName = {
    DUPLICATE_ENTRY: `DUPLICATE_ENTRY`,
    ITEM_DOES_NOT_EXIST: `ITEM_DOES_NOT_EXIST`,
    ITEM_DOES_NOT_EXIST_IN_CART: `ITEM_DOES_NOT_EXIST_IN_CART`,
    CART_DOES_NOT_EXIST: `CART_DOES_NOT_EXIST`,
    SOLD_OUT: `SOLD_OUT`,
    OWNER_DOES_NOT_EXIST: `OWNER_DOES_NOT_EXIST`,
    INCORRECT_PASSWORD: `INCORRECT_PASSWORD`,
    AUTHENTICATION_ERROR: `AUTHENTICATION_ERROR`
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
        message: `That itemId does not exist in the cart. Please input a proper item that the cart holds`,
        statusCode: 400
    },
    CART_DOES_NOT_EXIST: {
        message: `That cart does not exist. Please signup for a cart first.`,
        status: 400
    },
    SOLD_OUT: {
        message: `Cart check failed. A product in your cart is sold out/inventory shortage`,
        status: 400
    },
    OWNER_DOES_NOT_EXIST: {
        message: `There is no cart with that owner name`,
        status: 400
    },
    INCORRECT_PASSWORD: {
        message: `Incorrect password error. Please try again`,
        status: 400
    },
    AUTHENTICATION_ERROR: {
        message: `You are not authenticated. Please login or signup first`,
        status: 400
    }
}