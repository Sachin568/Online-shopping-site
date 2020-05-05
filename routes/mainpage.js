const express = require("express");
const router = express.Router();
const data = require("../data");

const productsData = data.products;



router.get("/", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    if (req.session.isAuthenticated) {
        res.render("pages/mainpage", { userInfo: req.session.userInfo })
    } else {
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

        res.render("pages/mainpage", { products: offeredProducts, status: status })

    }
});


module.exports = router;