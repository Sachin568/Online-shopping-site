const express = require("express");
const router = express.Router();
const data = require("../data");
const prodData = data.products;

router.get("/:id", async (req, res) => {
  try {
    const prodDetails = await prodData.getProduct(req.params.id);

    res.status(200).json(prodDetails);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

;

module.exports = router;