const Sequelize = require('sequelize');

const ProductModel = require('./models/product');
const CartModel = require('./models/cart');
const CartItemModel = require('./models/cartItem');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
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

  // For testing
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('pencil', .99, 62);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('binder', 4.99, 5);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('eraser', 1.29, 37);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('highlighter', 1.19, 14);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('marker', 1.49, 21);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('ruler', 2.99, 7);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('laptop', 499.99, 1);", { type: sequelize.QueryTypes.INSERT});
})

module.exports = { Product, Cart, CartItem, sequelize };