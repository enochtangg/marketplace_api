const {buildSchema} = require('graphql');

const productSchemas = require('./schemas/products');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    ${productSchemas.Product}
    
    type Query {
        ${productSchemas.ProductQueries}
    }
`);

module.exports = schema;