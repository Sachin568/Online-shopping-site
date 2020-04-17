const express = require("express");
const router = express.Router();
const data = require("../data");
const prodData = data.products;

router.get("/:id", async (req, res) => {
    try {
	  const prodDetails = await prodData.getProduct(req.params.id);

      res.status(200).json(prodDetails);   
    } catch (e) {
      res.status(404).json({error: e});
    }
});

router.post("/", async (req, res) => {
    const prodData = req.body;
    try {
      const { prodName, prodDetails, prodPrice, prodRating } = prodData;
      const prod = await prodData.addProd( prodName, prodDetails, prodPrice, prodRating );
      res.status(200).json(prod);
    } catch (e) {
      res.status(400).json({ error: e });
    }
});

module.exports = router;