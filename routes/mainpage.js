const express = require("express");
const paginate = require('express-paginate');
const router = express.Router();
const data = require("../data");

const productsData = data.products;

router.get("/:page*?", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    const page = req.query.page || 1
    // console.log(page, req.query.limit, req.skip)
    console.log("searchon",req.query.searhOn)
    let offeredProducts, status, searchOn, totalPagesCount
    if (typeof (req.query.searchOn) == "undefined") {
        offeredProducts = await productsData.getAllProducts(req.query.limit, req.skip)
        status = "offer all"
        console.log(`Returning all products`)
    } else {
        searchOn = req.query.searchOn
        offeredProducts = await productsData.searchProductByName(searchOn,req.query.limit, req.skip)
        status = `offer ${searchOn}`
        console.log(`Returning products with name ${searchOn}`)
    }
    totalPagesCount = Math.ceil(offeredProducts.listSize / req.query.limit)

    // console.log(paginate.getArrayPages(req)(3, totalPagesCount, req.query.page))
    res.status(200).render("pages/mainpage", {
        pagination: {
            page: page,
            pageCount: totalPagesCount
        },
        products: offeredProducts.productList,
        // pages: paginate.getArrayPages(req)(3, totalPagesCount, req.query.page),
        status: status
    })//userInfo: req.session.userInfo,


});


module.exports = router;