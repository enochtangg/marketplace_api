const {Product} = require('../database/sequelize');
const {Cart} = require('../database/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const ProductResolvers = require('./resolvers/products');

const { errorName } = require('../utlils/errors');

// The root provides a resolver function for each API endpoint
const root = {
    getOneProduct: async ({ id }) => {
        return await Product.findAll({
            where: {
                id: id
            }
        });
    },
    getAllProducts: async ({ onlyAvailableInventory }) => {
        if (!onlyAvailableInventory) {
            return await Product.findAll();
        } else {
            return await Product.findAll({
                where: {
                    inventory_count: {
                        [Op.gt]: 0
                    }
                }
            })
        }
    },
    getOneCart: async ({ id }) => {
        return await Cart.findAll({
            where: {
                id: id
            }
        });
    },
    getAllCarts: async () => {
        return await Cart.findAll();
    },
    createCart: async ({ owner }) => {
        await Cart.findOrCreate({
            where: {
              owner: owner.trim()
            },
            defaults: { // set the default properties if it doesn't exist
              owner: owner.trim()
            }
          }).then(async (result) => {
            let cart = result[0] // the instance of the cart
            let created = result[1]; // boolean stating if it was created or not
      
            if (!created) { // false if author already exists and was not created.
                throw new Error(errorName.DUPLICATE_ENTRY);
            }
            console.log('Created cart');
        });
        return await Cart.findAll({
            where: {
                owner: owner.trim()
            }
        });
    }
};

module.exports = root;

