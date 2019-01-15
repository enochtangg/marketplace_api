const ProductResolvers = {}

ProductResolvers.getOneProduct = async ({ id })  => {
    return await Product.findAll({
        where: {
            id: id
        }
    });
}

ProductResolvers.getAllProducts = async ({ onlyAvailableInventory }) => {
    if (!onlyAvailableInventory) {
        return await Product.findAll();
    } else {
        return await Product.findAll({
            where: {
                inventory_count: {
                    [Op.gt]: 0
                }
            }
        });
    }
}

module.exports = ProductResolvers;