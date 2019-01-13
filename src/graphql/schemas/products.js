exports.Product = `
type Product {
    id: Int
    title: String
    price: Float
    inventory_count: Int
}`;

exports.ProductQueries = `
    getOneProduct(id: Int!): [Product]
    getAllProducts(onlyAvailableInventory: Boolean!): [Product]
`;