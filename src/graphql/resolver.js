const productsData = require('../database/models/product');

const productResolver = require('./resolvers/products');

// The root provides a resolver function for each API endpoint
const root = {
    getOneProduct: ({ id }) => {
        null
    },
    getAllProducts: ({ onlyAvailableInventory}) => {
        null
    }
};

module.exports = root;

