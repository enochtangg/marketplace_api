exports.Cart = `
type Cart {
    id: Int
    owner: String
    sub_total: Float
    total: Float
    number_of_items: Int
}`;

exports.CartQueries = `
    getOneCart(id: Int!): [Cart]
    getAllCarts: [Cart]
`;

exports.CartMutations = `
    createCart(owner: String!): Cart
`;