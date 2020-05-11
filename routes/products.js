const express = require("express");
const router = express.Router();
const data = require("../data");
const prodData = data.products;
const usersData = data.users
const commentsData = data.comments


router.get("/:id", async (req, res) => {
  let prodDetails
  try {
    prodDetails = await prodData.getProductById(req.params.id);
  } catch (e) {
    res.redirect("/mainpage");
    return
  }
  prodDetails.reviews = await commentsData.substantiate(prodDetails.reviews)
  res.status(200).render("pages/singleProduct", { prodDetails: prodDetails });

});
//add item to user's cart
router.post("/addCart", async (req, res) => {
  let user
  let userId = req.session.userId
  console.log("geting", req.body, userId)
  try {
    user = await usersData.getUserById(userId)
  } catch (e) {
    res.status(400).send({ errormessage: "please log in." })//"pages/signup", 
    return
  }
  let userCart = user.shoppingCart
  userCart.push(req.body.ProductToCart)
  try {
    usersData.patchUser(user._id, { "shoppingCart": userCart })
  } catch{
    throw `unable to add item.`
  }
  console.log("Item has been added into user", user.basicInfo.username, "'s cart")
  console.log(await usersData.getUserById(userId))
  res.sendStatus(200);
})
router.post("/addwishlist", async (req, res) => {
  let user
  let userId = req.session.userId
  console.log("geting", req.body, userId)
  try {
    user = await usersData.getUserById(userId)
  } catch (e) {
    res.status(400).send({ errormessage: "please log in." })//"pages/signup", 
    return
  }
  let userWishList = user.wishList
  userWishList.push(req.body.ProductTowishList)
  try {
    usersData.patchUser(user._id, { "wishList": userWishList })
  } catch{
    throw `unable to add item.`
  }
  console.log("Item has been added into user", user.basicInfo.username, "'s wishList")
  console.log(await usersData.getUserById(userId))
  res.sendStatus(200);
})
// move to cart and delete from wishlist
router.post("/movetowishlist", async (req, res) => {
  let user
  let userId = req.session.userId
  try {
    user = await usersData.getUserById(userId)
  } catch (e) {
    res.status(400).send({ errormessage: "please log in." })//"pages/signup", 
    return
  }
  let userWishList = user.wishList
  let userShoppingCart = user.shoppingCart
  userWishList.splice(userWishList.indexOf(req.body.ProductMoveToCart), 1)
  userShoppingCart.push(req.body.ProductMoveToCart)

  try {
    usersData.patchUser(user._id, { "wishList": userWishList,"shoppingCart":userShoppingCart })
  } catch{
    throw `unable to add item.`
  }
  console.log("Item has been moved to user", user.basicInfo.username, "'s cart")
  console.log(await usersData.getUserById(userId))
  res.sendStatus(200);
})
//remove item in user's cart
router.post("/removeItemFromCart", async (req, res) => {
  let user
  let userId = req.session.userId
  let itemId = req.body.ProductToRemove
  console.log("user", req.body, userId, "is trying to remove", itemId, "from cart.")
  try {
    user = await usersData.getUserById(userId)
  } catch (e) {
    res.status(400).send({ errormessage: "please log in." })//"pages/signup", 
    return
  }
  let userCart = user.shoppingCart
  userCart.splice(userCart.indexOf(itemId), 1)
  try {
    usersData.patchUser(user._id, { "shoppingCart": userCart })
  } catch{
    throw `unable to remove item.`
  }
  console.log("Item has been removed from", user.basicInfo.username, "'s cart")
  console.log(await usersData.getUserById(userId))
  res.sendStatus(200);
})

router.post("/removeItemFromWishlist", async (req, res) => {
  let user
  let userId = req.session.userId
  let itemId = req.body.ProductToRemove
  console.log("user", req.body, userId, "is trying to remove", itemId, "from wishlist.")
  try {
    user = await usersData.getUserById(userId)
  } catch (e) {
    res.status(400).send({ errormessage: "please log in." })//"pages/signup", 
    return
  }
  let userWishlist = user.wishList
  userWishlist.splice(userWishlist.indexOf(itemId), 1)
  try {
    usersData.patchUser(user._id, { "wishList": userWishlist })
  } catch{
    throw `unable to remove item.`
  }
  console.log("Item has been removed from", user.basicInfo.username, "'s wishlist")
  console.log(await usersData.getUserById(userId))
  res.sendStatus(200);
})
module.exports = router;