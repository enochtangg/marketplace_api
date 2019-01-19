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
    getCart: async ({owner}) => {
        if (cartExistsInCarts(owner)) {
            return await Cart.findOne({
                where: {
                    owner: owner
                }
            }).then(async cartData => {
                let cartItems = await getAllAssociatedCartItems(cartData.id);
    
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
        } else {
            throw new Error(errorName.CART_DOES_NOT_EXIST);
        }
        
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
    addItemToCart: async({ owner, productId, quantity }) => {
        // Check if cart exists 
        if (await cartExistsInCarts(owner)) {
            let cart = await Cart.find({
                where: {
                    owner: owner
                }
            })
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
                    await CartItem.build({productId: productId, productTitle: product.title, productPrice: product.price, quantity: quantity, cartId: cart.id}).save();
                    await incrementNumberOfItems(cart.id); // update number of items in cart
                }            
                
                await updateCartTotals(cart.id); // update totals

                return await root.getCart({owner: owner});
            } else {
                throw new Error(errorName.ITEM_DOES_NOT_EXIST);
            }
        } else {
            throw new Error(errorName.CART_DOES_NOT_EXIST);
        }
        
    },
    removeItemFromCart: async({ owner, productId }) => {
        // Check if cart exists 
        if (await cartExistsInCarts(owner)) {
            let cart = await root.getCart({owner: owner});
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
                
                await updateCartTotals(cart.id); // update totals
                return await root.getCart({owner: owner});

            } else {
                throw new Error(errorName.ITEM_DOES_NOT_EXIST);
            }
        } else {
            throw new Error(errorName.CART_DOES_NOT_EXIST);
        }
    },
    checkoutCart: async ({ owner }) => {
        // check if cart exists
        if (await cartExistsInCarts(owner)) {
            let data = await root.getCart({owner: owner});

            // check if enough inventory
            let cartItems = data.cartedItems;
            for (let cartItem of cartItems) {
                let product = await Product.find({
                    where: {
                        id: cartItem.productId
                    }
                });
                if (cartItem.quantity > product.inventoryCount) {
                    throw new Error(errorName.SOLD_OUT);
                }
            }

            // remove cartItems
            for (let cartItem of cartItems) {
                await CartItem.destroy({
                    where: {
                        productId: cartItem.productId
                    }
                })
            }
            
            // remove cart
            await Cart.destroy({
                where: {
                    id: data.id
                }
            });

            // decrement inventory
            for (let cartItem of cartItems) {
                await decrementItemInventory(cartItem.productId, cartItem.quantity);
            }

            let message = `You have successfully checked out your cart`
            return message;
        } else {
            throw new Error(errorName.CART_DOES_NOT_EXIST);
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

async function cartExistsInCarts(owner) {
    return await Cart.count({
        where: {
            owner: owner.trim()
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

async function decrementItemInventory(itemId, value) {
    await Product.find({
        where: {
            id: itemId
        }
    }).then(async option => {
        await option.increment('inventoryCount', { by: -value });
    });
}

async function updateCartTotals(cartId) {
    async function getCartSubtotal(cartId) {
        let cartItems = await getAllAssociatedCartItems(cartId);
        let subtotal = 0;
        for (let cartItem of cartItems) {
            subtotal += (cartItem.productPrice *cartItem.quantity)
        }
        return subtotal;
    }

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

async function getAllAssociatedCartItems(cartId) {
    return await CartItem.findAll({
        where: {
            cartId: cartId
        }
    });
}

module.exports = root;

