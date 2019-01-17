const {Product} = require('../database/sequelize');
const {Cart} = require('../database/sequelize');
const {CartItem} = require('../database/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const { errorName } = require('../utlils/errors');

// The root provides a resolver function for each API endpoint
const root = {
    getOneProduct: async ({ id }) => {
        return await Product.findOne({
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
        return await Cart.findOne({
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
        // Check if the item exists in products
        if (await itemExistsInProducts(productId)) {
            // Check if the item is already carted, if it already is then just increase the quantity
            if (await itemExistsInCartItems(productId)) {
                await CartItem.find({
                    where: {
                        productId: productId
                    }
                }).then(async option => {
                    await option.increment('quantity', { by: quantity });
                });
            } else {
                let product = await root.getOneProduct({id: productId});
                await CartItem.build({productId: productId, productTitle: product.title, productPrice: product.price, quantity: quantity, cartId: cartId}).save();
                await incrementNumberOfItems(cartId); // update number of items in cart
            }            
            
            await updateCartTotals(cartId); // update totals

            return await root.getOneCart({id: cartId});
        } else {
            throw new Error(errorName.ITEM_DOES_NOT_EXIST);
        }
    },
    removeItemFromCart: async({ cartId, productId }) => {
        // Check if the item exists in products
        if (await itemExistsInProducts(productId)) {
            // Check if the item is already carted, if it already is then just increase the quantity
            if (await itemExistsInCartItems(productId)) {
                await CartItem.destroy({
                    where: {
                        productId: productId
                    }
                })
            } else {
                throw new Error(errorName.ITEM_DOES_NOT_EXIST_IN_CART);
            }         
            
            await updateCartTotals(cartId); // update totals

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

async function incrementNumberOfItems(cartId) {
    await Cart.find({
        where: {
            id: cartId
        }
    }).then(async option => {
        await option.increment('numberOfItems');
    });
}

async function updateCartTotals(cartId) {
    let subtotal = await getCartSubtotal(cartId);
    let total = subtotal*1.13;
    await Cart.update(
        { 
            subtotal: (subtotal).toFixed(2),
            total: (total).toFixed(2)
        },
        { where: { id: cartId } }
    )
}

async function getCartSubtotal(cartId) {
    let cartItems = await getAllAssociatedCartItems(cartId);
    let subtotal = 0;
    for (let cartItem of cartItems) {
        subtotal += cartItem.productPrice * cartItem.quantity;
    }
    return subtotal;
}

async function updateCartTotal(cartId) {

}

async function getAllAssociatedCartItems(cartId) {
    return await CartItem.findAll({
        where: {
            cartId: cartId
        }
    });
}

module.exports = root;

