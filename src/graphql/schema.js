const {buildSchema} = require('graphql');

const productSchemas = require('./schemas/products');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    product(id: Int!): Product
    all_products: [Product]
  }
  type Product {
      id: Int
      title: String
      price: Float
      inventory_count: Int
  }
`);

module.exports = schema;