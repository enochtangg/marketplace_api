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
    getOneCart(id: Int!): Cart
    getAllCarts: [Cart]
`;

exports.CartMutations = `
    createCart(owner: String!): Cart
    addItemToCart(productId: Int!, cartId: Int!, quantity: Int!): Cart
    removeItemFromCart(productId: Int!, cartId: Int!): Cart
`;