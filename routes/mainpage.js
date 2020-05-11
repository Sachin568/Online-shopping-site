const express = require("express");
const paginate = require('express-paginate');
const router = express.Router();
const data = require("../data");

const productsData = data.products;

router.get("/:page*?", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    const page = req.params.page || 1
    console.log(req.query.limit, req.skip)
    let offeredProducts, status, searchOn, itemCount, pageCount
    if (typeof (req.query.searchOn) == "undefined") {
        offeredProducts = await productsData.getAllProducts(req.query.limit, req.skip)
        status = "offer all"
        pageCount = Math.ceil(offeredProducts.itemCount / req.query.limit)
        console.log(offeredProducts.itemCount, pageCount)
    } else {
        searchOn = req.query.search
        offeredProducts = await productsData.searchProductByName(searchOn)
        status = `offer ${searchOn}`
        console.log(`Returning products with name ${searchOn}`)
    }
    // console.log(req.session)
    res.status(200).render("pages/mainpage", {
        // pagination: {
        //     page: page,
        //     pageCount: pageCount
        // },
        products: offeredProducts.productList,
        pageCount: pageCount,
        itemCount: itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
        status: status
    })//userInfo: req.session.userInfo,


});


module.exports = router;