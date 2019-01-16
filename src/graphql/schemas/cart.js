exports.Cart = `
type CartItem{
    id: Int
    cartId: Int
    productId: Int
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
    addItemToCart(item_id: Int!, cart_owner: String!): Cart
`;