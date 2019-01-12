const Sequelize = require('sequelize');
const ProductModel = require('./models/product');

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

sequelize.sync({ force: true }).then(() => {
  console.log(`Database & tables created!`);
})

module.exports = { Product, sequelize };