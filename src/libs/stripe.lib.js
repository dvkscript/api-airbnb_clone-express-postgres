const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getStripe = () => stripe;

module.exports = {
    getStripe
}