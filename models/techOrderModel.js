const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const techOrders = sequelize.define("techOrders", {
    quentity: {
      type: DataTypes.INTEGER,
      default: false,
    },
    orderPrice: {
      type: DataTypes.DECIMAL(10, 2),
      default: false,
    },
    return_Product: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return techOrders;
};
