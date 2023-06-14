const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const orders = sequelize.define('orders',{
    orderquentity:{
        type:DataTypes.INTEGER
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },

});
return orders
}