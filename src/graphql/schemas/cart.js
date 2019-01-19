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
    getCart: Cart
`;

exports.CartMutations = `
    login(owner: String!, password: String!): String
    signup(owner: String!, password: String!): String
    addItemToCart(productId: Int!, quantity: Int!): Cart
    removeItemFromCart(productId: Int!): Cart
    checkoutCart: String
`;