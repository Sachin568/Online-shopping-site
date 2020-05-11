const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const productsData = data.products
const commentsData = data.comments
// const ordersData = require("../data/orders")

ObjectId = require('mongodb').ObjectID;


router.post("/", async (req, res) => {
    const productId = req.body['commentProduct']
    const content = req.body['content']
    const rating = req.body['rating']
    console.log(req.body)
    //get user first
    let user, comment
    try {
        user = await usersData.getUserById(req.session.userId)
    } catch{
        res.status(400).send({ errormessage: "please log in." })
        return
    }
    try {
        comment = await commentsData.addComment(content, ObjectId(req.session.userId), ObjectId(productId), parseInt(rating))
    } catch (error) {
        console.log(error)
        res.status(400).send({ errormessage: "cannot add comment" })
        return
    }
    // res.send({message:"Your comment has been added."})
    res.sendStatus(200);

});

module.exports = router;