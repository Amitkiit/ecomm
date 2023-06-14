//const { where } = require("sequelize");
const db = require("../models/mainModel");
const TechProduct = db.techProducts;
const TechRating = db.techRatings;
const Users = db.users;
const TechOrders = db.techOrders;

const orderCreateForTechProd = async function (req, res) {
  let data = req.body;
  const { user_Id, techProd_Id, quentity } = data;
  let userCheck = await Users.findOne({
    where: {
      id: user_Id,
    },
  });
  if (!userCheck)
    return res.status(400).send({
      status: false,
      message: "before placing the order first need to complete registration",
    });
  let techProdCheck = await TechProduct.findOne({
    where: {
      id: techProd_Id,
    },
  });

  if (!techProdCheck)
    return res
      .status(400)
      .send({ status: false, message: "this prod is not exist" });

  let quentityCheck = techProdCheck.quentity;
  if (quentityCheck < quentity)
    return res.status(400).send({
      status: false,
      message: "quentity have not sufficient for order",
    });

  let userBalanceCheck = userCheck.balance;
  let orderPriceCheck = techProdCheck.price * quentity;
  if (userBalanceCheck < orderPriceCheck)
    return res
      .status(400)
      .send({ status: false, message: "user have insufficient balance" });
  data.orderPrice = orderPriceCheck;
  let createOrder = await TechOrders.create(data);
  if (createOrder) {
    //createOrder.return_Product = 0;
    await Users.update(
      {
        balance: userCheck.balance - orderPriceCheck,
      },
      {
        where: {
          id: user_Id,
        },
      }
    );
    await TechProduct.update(
      {
        quentity: techProdCheck.quentity - quentity,
      },
      {
        where: {
          id: techProd_Id,
        },
      }
    );
  }
  res.status(201).send({ status: true, data: createOrder });
};

//===============manage product ordering and return / refund statuses=======================//

const returnProduct = async function (req, res) {
  let data = req.body;
  const { user_Id, techProd_Id, order_Id } = data;

  let checkOrder = await TechOrders.findOne({
    where: {
      id: order_Id,
      user_Id: user_Id,
      techProd_Id: techProd_Id,
    },
  });

  //console.log(checkOrder.return_Product)

  if (checkOrder && checkOrder.return_Product===false) {
    
    await TechOrders.update(
      {
        return_Product:1,
      },
      {
        where: {
          id: order_Id,
        },
      }
    );

    let userCheck = await Users.findOne({
      where: {
        id: user_Id,
      },
    });
    let techProdCheck = await TechProduct.findOne({
      where: {
        id: techProd_Id,
      },
    });
    // console.log(`userBalace: ${userCheck.balance}`)
    // console.log(`orderPrice: ${checkOrder.orderPrice}`)
    //checkOrder.return_Product = 0;
    await Users.update(
      {
        balance: parseInt(userCheck.balance) + parseInt(checkOrder.orderPrice),
      },
      {
        where: {
          id: user_Id,
        },
      }
    );
    await TechProduct.update(
      {
        quentity:
          parseInt(techProdCheck.quentity) + parseInt(checkOrder.quentity),
      },
      {
        where: {
          id: techProd_Id,
        },
      }
    );
    // checkOrder.return_Product = 0; // Set return_Product to 0

    await checkOrder.save();

    return res
      .status(200)
      .send({ status: true, message: "your return is successfully" });
  } else {
    return res
      .status(400)
      .send({ status: false, message: "your order is already return " });
  }
};

module.exports = { orderCreateForTechProd, returnProduct };
