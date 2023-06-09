const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('ecommercedb','root','Amit@1604',{

host : "localhost",
dialect : 'mysql',
logging : false,
pool : {max:5,min:0,idle:10000}
})

sequelize.authenticate()
.then(()=> {
console.log("connected");
})
.catch( err => {
console.log(err);
})

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel')(sequelize,DataTypes);
db.products= require('./productModel')(sequelize,DataTypes);
db.orders = require('./orderModel')(sequelize,DataTypes);
db.likes= require('./likeModel')(sequelize,DataTypes);
db.datamaintains= require('./dataMaintainModel')(sequelize,DataTypes);
//================adding electric product=======================//
db.techRatings = require('./techRatingModel')(sequelize,DataTypes);
db.techProducts=require('./techModel')(sequelize,DataTypes);
db.techOrders= require('./techOrderModel')(sequelize,DataTypes);

//====================relation between user and product==============================//
// db.users.hasMany(db.products,{
//     foreignKey:'user_Id',
//     as:"products"
// })

// db.products.belongsTo(db.users, {
//      foreignKey: 'user_Id',
//      as:"users"
// })

//===============relation between user like========================================================//

db.users.hasMany(db.likes,{
    foreignKey:'user_Id',
    as:"likes"
})

db.likes.belongsTo(db.users, {
     foreignKey: 'user_Id',
     as:"users"
})

//======================relation between product and like =====================================//

db.products.hasMany(db.likes,{
    foreignKey:'product_Id',
    as:"likes"
})

db.likes.belongsTo(db.products, {
     foreignKey: 'product_Id',
     as:"products"
})

//======================relation between product and order========================================//
db.products.hasMany(db.orders,{
    foreignKey:'product_Id',
    as:"orders"

})

db.orders.belongsTo(db.products,{
    foreignKey:'product_Id',
    as:'products'
})
//=======================relation between order and user============================================================//
db.users.hasMany(db.orders,{
    foreignKey:'user_Id',
    as:"orders"

})
db.orders.belongsTo(db.users,{
    foreignKey:'user_Id',
    as:'users'
})
//===========relation between user , techRating techProduct====================================//
db.users.hasMany(db.techRatings,{
    foreignKey:'user_Id',
    as:"techRatings"
})

db.techRatings.belongsTo(db.users, {
     foreignKey: 'user_Id',
     as:"users"
})
db.techProducts.hasMany(db.techRatings,{
    foreignKey:'techProd_Id',
    as:"techRatings"
})

db.techRatings.belongsTo(db.techProducts, {
     foreignKey: 'techProd_Id',
     as:"techProducts"
})


//===========relation between orderColumn,userId,productId =======================================//

db.users.hasMany(db.techOrders,{
    foreignKey:'user_Id',
    as:"techOrders"
})

db.techOrders.belongsTo(db.users, {
     foreignKey: 'user_Id',
     as:"users"
})

db.techProducts.hasMany(db.techOrders,{
    foreignKey:'techProd_Id',
    as:"techOrders"
})

db.techOrders.belongsTo(db.techProducts, {
     foreignKey: 'techProd_Id',
     as:"techProducts"
})

//==========================relation between order and rating==============//

db.techOrders.hasMany(db.techRatings,{
    foreignKey:'order_Id',
    as:"techRatings"
})

db.techRatings.belongsTo(db.techOrders, {
     foreignKey: 'order_Id',
     as:"techOrders"
})










//-------------------------------------------------------------------------------------------------------------//

db.sequelize.sync({force:false})
.then(()=> {
console.log("yes re sync");
})

module.exports = db;