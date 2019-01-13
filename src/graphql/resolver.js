const {Product} = require('../database/sequelize');

const productResolver = require('./resolvers/products');

// The root provides a resolver function for each API endpoint
const root = {
    getOneProduct: async ({ id }) => {
        return await Product.findAll({
            where: {
                id: id
            }
        });
    },
    getAllProducts: async ({ onlyAvailableInventory}) => {
        if (!onlyAvailableInventory) {
            return await Product.findAll();
        }
    }
};

module.exports = root;

