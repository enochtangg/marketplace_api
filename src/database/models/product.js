module.exports = (sequelize, type) => {
    return sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: type.STRING,
        price: type.DOUBLE,
        inventory_count: type.INTEGER
    })
}