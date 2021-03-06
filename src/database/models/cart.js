module.exports = (sequelize, type) => {
    return sequelize.define('cart', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        owner: {
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        subtotal: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        total: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        numberOfItems: {
            type: type.INTEGER,
            defaultValue: 0
        }
    }, { timestamps: false })
}