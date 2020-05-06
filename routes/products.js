const express = require("express");
const router = express.Router();
const data = require("../data");
const prodData = data.products;

router.get("/:id", async (req, res) => {
  let prodDetails
  try {
    prodDetails = await prodData.getProductById(req.params.id);
    console.log(prodDetails);
  } catch (e) {
    res.status(404).json({ error: e });
  }
  console.log(prodDetails)
  res.status(200).render("pages/singleProduct", { prodDetails: prodDetails });

});

;

module.exports = router;