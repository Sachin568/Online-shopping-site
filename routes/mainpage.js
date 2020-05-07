const express = require("express");
const router = express.Router();
const data = require("../data");

const productsData = data.products;

router.get("/", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    console.log(req.query)
    let offeredProducts, status, searchOn
    if (Object.keys(req.query).length === 0) {
        offeredProducts = await productsData.getAllProducts()
        status = "offer all"
    } else {
        searchOn = req.query.search
        offeredProducts = await productsData.searchProductByName(searchOn)
        status = `offer ${searchOn}`
    }
    console.log(`Returning products with name ${searchOn}`)
    // console.log(req.session)
    res.status(200).render("pages/mainpage", {
        products: offeredProducts,
        status: status
    })//userInfo: req.session.userInfo,


});


module.exports = router;