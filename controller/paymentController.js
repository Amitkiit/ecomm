const { PUBLISHED_KEY, SECRETE_KEY } = process.env;

const stripe = require("stripe")(SECRETE_KEY);

const createCustomer = async function (req, res) {
  try {
    let data = req.body;
    let apiKey = req.headers.authorization.split(" ")[1]; // Extract the API key from the Authorization header
    //console.log(apiKey);
    let stripe = require("stripe")(apiKey); // Create a Stripe instance with the API key
    let customerCreate = await stripe.customers.create(data);
    res.status(201).send({ status: true, data: customerCreate });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const addNewCart = async function(req, res) {
    try {
      const apiKey = 'sk_test_51NI4ZjSJwGnnOhWJXLKGHzq60qUe8LdDqrmTUahcMSAehGELBEebo91seJMVBsNG5K3AVDyPcYoutN0EvJxJMenp00HiJ4vaOc'; // Replace 'YOUR_SECRET_KEY' with your actual Stripe API key
      const stripe = require('stripe')(apiKey); // Create a Stripe instance with the API key
  
      const data = req.body;
      const {
        customer_id,
        card_Name,
        card_ExpYear,
        card_ExpMon,
        card_CVC
      } = data;
      console.log("data passed by the postman is successfully")
      const token = await stripe.tokens.create({
        card: {
          name: card_Name,
          exp_year: card_ExpYear,
          exp_month: card_ExpMon,
          cvc: card_CVC,
          number: '4242424242424242', // Use a test card number here
        },
      });
      console.log("token is created ")

      console.log(token)
  
      const card = await stripe.customers.createSource(customer_id, {
        source: token.id,
      });
  
      res.status(200).send({ card: card.id });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

// const createCharge = async function(req,res){

// }

module.exports = { createCustomer, addNewCart };
