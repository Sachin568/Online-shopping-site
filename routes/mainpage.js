const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    if (req.session.isAuthenticated) {
        res.render("pages/mainpage", {userInfo: req.session.userInfo})
    } else {
        res.render("pages/mainpage", {})

    }
});


module.exports = router;