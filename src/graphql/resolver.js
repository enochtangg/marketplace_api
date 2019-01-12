const productsData = require('../database/products');

const productResolver = require('./resolvers/products');

// The root provides a resolver function for each API endpoint
const root = {
    product: ({ id }) => {
        null
    },
    all_products: () => {
        null
    }
};

module.exports = root;

