const Sequelize = require('sequelize');

const ProductModel = require('./models/product');
const CartModel = require('./models/cart');
const CartItemModel = require('./models/cartItem');

const sequelize = new Sequelize('marketplace', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const Product = ProductModel(sequelize, Sequelize);
const Cart = CartModel(sequelize, Sequelize);
const CartItem = CartItemModel(sequelize, Sequelize);

CartItem.belongsTo(Cart, {as: 'cart'});
CartItem.belongsTo(Product, {as: 'product'});

sequelize.sync({ force: true }).then(() => {
  console.log(`Database & tables created!`);
})

module.exports = { Product, Cart, CartItem, sequelize };