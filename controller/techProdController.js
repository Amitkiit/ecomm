const db = require("../models/mainModel");
const { sequelize, DataTypes, model, Op } = require("sequelize");

const TechProduct = db.techProducts;
const TechRating = db.techRatings;
const Users = db.users;

const techProduct = async function (req, res) {
  let data = req.body;
  const {
    productName,
    price,
    category,
    quentity,
    model,
    series,
    processer,
    graphic,
    image,
    ram,
    storage,
  } = data;
  //console.log(productName)
  const productCreate = await TechProduct.create(data);
  return res.status(201).send({ status: true, data: productCreate });
};

// =================create the rating =============================================//

const ratingOnProduct = async function (req, res) {
  let data = req.body;
  const { rating, user_Id, techProd_Id, order_Id } = data;
  //console.log(user_Id)
  if ((user_Id, techProd_Id, order_Id)) {
    const createProduct = await TechRating.create(data);
    return res.status(201).send({ status: true, data: createProduct });
  } else {
    return res
      .status(400)
      .send({ status: false, message: "Before placing the rating you need to buy this product" });
  }
};

const findUserWithRatingOnProduct = async function (req, res) {
  let techProd_Id = req.params.techProd_Id;
  let query = req.query;
  let userCheck = await TechProduct.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: TechRating,
        as: "techRatings",
        attributes: { exclude: ["id", "createdAt", "updatedAt", "quentity"] },
        where: {
          techProd_Id: techProd_Id,
          // rating: {
          //   [Op.eq]: query.rate,
          // },
        },
        include: [
          {
            model: Users,
            as: "users",
            attributes: {
              exclude: [
                "number",
                "password",
                "balance",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
    ],
  });
  if (!userCheck)
    return res.status(400).send({
      status: false,
      message:
        "before placing the review first complete your registration procesee",
    });

  let techProdCheck = await TechProduct.findOne({
    where: {
      id: techProd_Id,
    },
  });
  if (!techProdCheck)
    return res
      .status(400)
      .send({ status: false, message: "product is not exist" });

  return res
    .status(200)
    .send({ status: true, message: "data find successfuly", data: userCheck });
};

const fetchDataBaseOnTheFilter = async function (req, res) {
  let query = req.query;
  let filterOutData = await TechProduct.findAndCountAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: query,
  });
  if (filterOutData.count == 0)
    return res
      .status(400)
      .send({ status: false, message: "this type of the item is not exist" });
  res.status(200).send({ status: true, data: filterOutData });
};

module.exports = {
  techProduct,
  ratingOnProduct,
  findUserWithRatingOnProduct,
  fetchDataBaseOnTheFilter,
};
