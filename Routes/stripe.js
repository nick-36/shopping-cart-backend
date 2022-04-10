const router = require("express").Router();

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SEC);

router.post(
  "/create-checkout-session",

  async (req, res) => {
    const { line_items, customer_email } = req.body;

    if (!line_items || !customer_email) {
      return res
        .status(400)
        .json({ error: "Missing required session parameters" });
    }
    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.WEB_APP_URL}/success`,
        cancel_url: `${process.env.WEB_APP_URL}/failure`,
      });
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: "An error occured unable to create session" });
    }
  }
);

module.exports = router;
