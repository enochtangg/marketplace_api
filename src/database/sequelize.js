const Sequelize = require('sequelize');

const ProductModel = require('./models/product');
const CartModel = require('./models/cart');
const CartItemModel = require('./models/cartItem');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
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
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('pencil', 1.50, 32);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('binder', 5.00, 5);", { type: sequelize.QueryTypes.INSERT});
  sequelize.query("INSERT INTO products(title, price, inventoryCount) VALUES ('eraser', 2.25, 15);", { type: sequelize.QueryTypes.INSERT});
})

module.exports = { Product, Cart, CartItem, sequelize };