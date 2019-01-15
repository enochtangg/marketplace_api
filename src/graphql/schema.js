const {buildSchema} = require('graphql');

const productSchemas = require('./schemas/products');
const cartSchemas = require('./schemas/cart');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    ${productSchemas.Product}
    ${cartSchemas.Cart}
    
    type Query {
        ${productSchemas.ProductQueries}
        ${cartSchemas.CartQueries}
    }

    type Mutation {
        ${cartSchemas.CartMutations}
    } 
`);

module.exports = schema;