exports.Cart = `
type CartItem {
    id: Int
    cartId: Int
    productId: Int
    productTitle: String
    productPrice: Float
    quantity: Int
}
type Cart {
    id: Int
    owner: String
    subtotal: Float
    total: Float
    numberOfItems: Int
    cartedItems: [CartItem]
}`;

exports.CartQueries = `
    getCart(owner: String!): Cart
`;

exports.CartMutations = `
    createCart(owner: String!): Cart
    addItemToCart(productId: Int!, owner: String!, quantity: Int!): Cart
    removeItemFromCart(productId: Int!, owner: String!): Cart
    checkoutCart(owner: String!): String
`;