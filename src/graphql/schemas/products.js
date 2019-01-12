exports.Product = `
type Product {
    id: Int
    title: String
    price: Float
    inventory_count: Int
}`;

exports.ProductQueries = `
    product(id: Int!): Product
    all_products: [Product]
`;