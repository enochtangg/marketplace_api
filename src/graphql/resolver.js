const {Product} = require('../database/sequelize');
const {Cart} = require('../database/sequelize');
const {CartItem} = require('../database/sequelize');
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
        return await Cart.find({
            where: {
                id: id
            }
        }).then(async cartData => {
            let cartItems = await getAllAssociatedCartItems(id);
            const cart = {
                id: cartData.id,
                owner: cartData.owner,
                subtotal: cartData.subtotal,
                total: cartData.total,
                numberOfItems: cartData.numberOfItems,
                cartedItems: cartItems
            };
            return cart;
        });
    },
    getAllCarts: async () => {
        return await Cart.findAll();
        // attach cartItems to object?
    },
    createCart: async ({ owner }) => {
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
    addItemToCart: async({ cartId, itemId, quantity }) => {
        if (await itemExists(itemId)) {
            // create an instance of cartItem with relationship cartItem -> cart
            await CartItem.build({productId: itemId, quantity: quantity, cartId: cartId}).save()
        } else {
            // throw item does not exist error
            throw new Error(errorName.ITEM_DOES_NOT_EXIST);
        }
    }
};

async function itemExists(itemId) {
    return await Product.count({
        where: {
            id: itemId
        }
    }).then(count => {
        if (count != 0) {
            return false;
        }
        return true;
    })
}

async function getAllAssociatedCartItems(cartId) {
    return await CartItem.findAll({
        where: {
            cartId: cartId
        }
    });
}

module.exports = root;

