const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    res.render("pages/mainpage", {
    })
});


module.exports = router;