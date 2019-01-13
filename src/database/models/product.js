module.exports = (sequelize, type) => {
    return sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        title: {
            type: type.STRING,
            allowNull: false
        },
        price: {
            type: type.DOUBLE,
            allowNull: false
        },
        inventory_count: {
            type: type.INTEGER,
            allowNull: false
        }
    }, { timestamps: false })
}