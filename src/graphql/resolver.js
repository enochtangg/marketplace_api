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
    getOneUser: async ({ id }) => {
        return await Cart.findAll({
            where: {
                id: id
            }
        });
    },
    getAllUsers: async () => {
        return await Cart.findAll();
    },
    createUser: async ({ owner }) => {
        return await Cart.findOrCreate({
            where: {
              owner: owner.trim()
            },
            defaults: {
              owner: owner.trim()
            }
          }).then(async (result) => {
            let cart = result[0];
            let created = result[1];
      
            if (!created) {
                throw new Error(errorName.DUPLICATE_ENTRY);
            }
            console.log('Created cart');
            return cart;
        });
    },
    addItemToCart: async({ item_id, cart_owner }) => {
        // create an instance of cartItem with relationship cartItem -> cart
    }
};

module.exports = root;

