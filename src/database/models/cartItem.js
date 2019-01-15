module.exports = (sequelize, type) => {
    return sequelize.define('cartItem', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        productId: {
            type: type.INTEGER,
            allowNull: false
        },
        quantity: {
            type: type.INTEGER,
            allowNull: false
        },
        cartId: {
            type: type.INTEGER,
            allowNull: false
        }
    }, { timestamps: false })
}