const {Product} = require('../database/sequelize');
const {Cart} = require('../database/sequelize');
const {CartItem} = require('../database/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

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
    getOneCart: async ({id}) => {
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
    addItemToCart: async({ cartId, productId, quantity }) => {
        if (await itemExistsInProducts(productId)) {
            // if item doesnt already exists in cart then create new one
            if (await itemExistsInCartItems(productId)) {
                await CartItem.find({
                    where: {
                        productId: productId
                    }
                }).then(async option => {
                    await option.increment('quantity', { by: quantity });
                });
            } else {
                await CartItem.build({productId: productId, quantity: quantity, cartId: cartId}).save()
            }            
            
            await Cart.find({
                where: {
                    id: cartId
                }
            }).then(async option => {
                await option.increment('numberOfItems');
            });
            return await root.getOneCart({id: cartId});
        } else {
            throw new Error(errorName.ITEM_DOES_NOT_EXIST);
        }
    }
};

async function itemExistsInProducts(itemId) {
    return await Product.count({
        where: {
            id: itemId
        }
    }).then(count => {
        if (count != 0) {
            return true;
        }
        return false;
    })
}

async function itemExistsInCartItems(itemId) {
    return await CartItem.count({
        where: {
            productId: itemId
        }
    }).then(count => {
        if (count != 0) {
            return true;
        }
        return false;
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

