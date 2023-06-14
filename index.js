const mysql= require("mysql")
const express = require("express")
const route = require("./routes/route")
const app = express()
app.use(express.json())
require("./models/mainModel")


// const stripe = require('stripe')('sk_test_51NI4ZjSJwGnnOhWJXLKGHzq60qUe8LdDqrmTUahcMSAehGELBEebo91seJMVBsNG5K3AVDyPcYoutN0EvJxJMenp00HiJ4vaOc');

// stripe.products.create({
//   name: 'Starter Subscription',
//   description: '$12/Month subscription',
// }).then(product => {
//   stripe.prices.create({
//     unit_amount: 1200,
//     currency: 'usd',
//     recurring: {
//       interval: 'month',
//     },
//     product: product.id,
//   }).then(price => {
//     console.log('Success! Here is your starter subscription product id: ' + product.id);
//     console.log('Success! Here is your premium subscription price id: ' + price.id);
//   });
// });

app.use("/",route)


app.listen(3000,()=>{
    console.log("server is connected on : " + 3000)
})

