const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcrypt");
const url = require('url');
const ordersData = data.orders
const usersData = data.users;
const productsData = data.products

ObjectId = require('mongodb').ObjectID;
//helper functions
async function countAndCalculate(arr) {
    let hashtable = {}
    let value = 0
    //convert to hashtable first
    for (let id of arr) {
        hashtable[id] = hashtable[id] ? hashtable[id] + 1 : 1
    }
    //then add count property into each of the item returned
    detailedItems = []
    for (id in hashtable) {
        let item = await productsData.getProductById(id)
        item.count = hashtable[id]
        detailedItems.push(item)
        value += item.count * item.price
    }
    return { detailedItems: detailedItems, value: value }
}

router.get("/login", async (req, res) => {
    res.locals.metaTags = {
        title: "login page"
    }
    res.render("pages/login", {
    })
});
router.get("/signup", async (req, res) => {
    res.locals.metaTags = {
        title: "sign up page"
    }
    res.render("pages/signup", {
    })
});
//TODO:check if user already logged in: not possible
router.post("/login", async (req, res) => {
    let username = req.body['username']
    let psw = req.body['psw']
    let rememberMe = req.body['rememberme']// string "on" / undefined
    let user
    try {
        user = await usersData.getUserByName(username)
    } catch (e) {
        console.log(e)
        res.status(400).send({ errormessage: "Username or password is incorrect" })
        return
    }
    const hashedPassword = user.password
    const pswmatch = await bcrypt.compare(psw, hashedPassword)
    if (pswmatch) {
        console.log(`user ${username} logged in`)
        req.session.userInfo = username
        req.session.userId = String(user._id)
        //remember me logic here
        if (typeof (rememberMe) != "undefined") {
            req.session.cookie.expires = false
        } else {
            req.session.cookie.maxAge = 2 * 24 * 3600000; // expire after 2 days
        }

        res.status(200).send({ redirectURL: "/mainpage" })
        // res.redirect("/mainpage")
        // res.redirect(url.format({
        //     pathname: "/mainpage",
        //     userInfo: username,
        // }))
        // res.status(200).render("pages/mainpage", { userInfo: username, isAuthenticated :true })
    } else {
        res.status(400).send({ errormessage: "Username or password is incorrect" })
    }

});
router.post("/signup", async (req, res) => {
    let username = req.body['username']
    let birthdate = req.body['birthdate']
    let email = req.body['email']

    let psw = req.body['psw']
    // let psw_repeat = req.body['psw-repeat']
    // if (psw != psw_repeat) {
    //     res.status(400).render("pages/signup", { errormessage: "Password doesn't match" })
    //     return
    // }
    const basicInfo = {
        username: username,
        birthdate: birthdate,
    }
    console.log(`user "${email}" is trying to sign up`)
    let new_user
    try {
        new_user = await usersData.addUser(basicInfo, email, psw)
    } catch (e) {
        console.log(e)
        // res.status(400).render("pages/signup", { errormessage: e })
        res.send(400, { errormessage: e })//"pages/signup", 
        return
    }
    console.log(`Registration successed.`)
    req.session.userInfo = username
    req.session.userId = new_user._id
    // res.status(200).render("pages/mainpage")
    res.send({ redirectURL: "/users/login" })
});
//TODO:update user info
router.put("/:id", async (req, res) => {
    let user
    try {
        console.log('Getting user with ID:', req.params.id)
        user = await usersData.getUserById(ObjectId(req.params.id))

    } catch (e) {
        console.log("Failed finding user with Id:", req.params.id)
        res.status(404).json({ message: "User not found" })
        return
    }
    try {
        console.log('Updating user with ID:', req.params.id)
        const data = req.body;
        band = await usersData.updateUser(ObjectId(req.params.id), data.basicInfo, data.email, data.address)
        res.status(200).json(band)
    } catch (e) {
        console.log("Failed updating user with Id:", req.params.id)
        res.status(400).json({ message: "Update failed. JSON provided does not match schema?" });
    }
});
//TODO:not used
router.delete("/:id", async (req, res) => {
    let removedUser
    try {
        removedUser = await usersData.removeUser(req.params.id)
    } catch (e) {
        res.status(404).json({ error: "Can not find user with that id." })
        return
    }
    try {
        console.log('Removing user with ID:', req.params.id)
        res.status(200).json({
            deleted: true,
            data: removedUser
        })
    } catch (e) {
        res.status(400).json({ message: "Can not remove user with that Id" })
    }
});
//TODO:not used
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const newUser = await usersData.addUser(data.basicInfo, data.email, data.address, data.password)
        res.status(200).json(newUser)
    } catch (e) {
        res.status(400).json({ message: "JSON provided does not match schema." })
    }
});
router.get("/logout", async (req, res) => {
    req.session.destroy()
    res.clearCookie("userInfo")
    res.redirect("/mainpage")
})
//view user info and making changes here
router.get("/account", async (req, res) => {
    console.log("user", req.session.userInfo, "is accessing account page.")
    let userId = req.session.userId
    let user
    try {
        user = await usersData.getUserById(userId)
    } catch{
        throw "wtf is happening"
    }
    delete user._id;
    res.status(200).render("pages/account", { userDetails: user })
})
//update user info here
router.post("/account", async (req, res) => {
    console.log("user", req.session.userInfo, "is making changes to the info.")
    console.log(req.body)
    const userId = req.session.userId
    const newEmail = req.body['email']
    const newStreet = req.body['street']
    const newCity = req.body['city']
    const newState = req.body['state']
    const newZipCode = req.body['zipCode']
    let newAddress = {
        state: newState,
        city: newCity,
        street: newStreet,
        zipCode: newZipCode
    }

    let updatedUser
    try {
        updatedUser = await usersData.updateUser(userId, newEmail, newAddress)
    } catch (e) {
        res.status(400).send({ errormessage: e })
        return
    }
    console.log(updatedUser)

    delete updatedUser._id;
    res.status(200).send({ redirectURL: "/users/account", message: "Your info have been updated." })
})

//change psw here
router.get("/pswchange", async (req, res) => {
    console.log("user", req.session.userInfo, "is accessing psw changing page.")
    if (!req.session.userId || typeof (req.session.userId) == "undefined") {
        res.redirect("/mainpage")
        return
    }
    res.status(200).render("pages/pswchange")
})
//TODO: clear cookie and session
router.post("/pswchange", async (req, res) => {
    const oldPsw = req.body['old-psw']
    const newPsw = req.body['new-psw']
    const birthdate = req.body['birthdate']
    console.log("user", req.session.userInfo, "is trying to change psw.")
    console.log(oldPsw, newPsw)
    let user
    try {
        user = await usersData.getUserById(req.session.userId)
    } catch{
        throw "no user found"
    }
    if (birthdate != user.basicInfo.birthdate) {
        res.status(400).send({ errormessage: "Your birthdate is not match." })
        return
    }
    try {
        const mtp = await usersData.updateUserPsw(req.session.userId, oldPsw, newPsw)
    } catch (e) {
        res.status(400).send({ errormessage: e })
        return
    }
    //let user to login again
    req.session.destroy()
    res.clearCookie("userInfo")
    res.status(200).send({ redirectURL: "/users/login", message: "Your password has been changed" })
})

router.get("/shoppingcart", async (req, res) => {
    console.log("user", req.session.userInfo, "is accessing shopping cart.")
    console.log(req.session.userId)
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    let userShoppingCartIds
    try {
        userShoppingCartIds = await usersData.getUserCart(userId)
    } catch{
        return
    }
    let returned = await countAndCalculate(userShoppingCartIds)

    res.status(200).render("pages/shoppingCart", { cartList: returned.detailedItems, cartTotalValue: returned.value })
})

router.get("/wishlist", async (req, res) => {
    console.log("user", req.session.userInfo, "is accessing wish list.")
    console.log(req.session.userId)
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    let userWishlistIds
    try {
        userWishlistIds = await usersData.getUserWishlist(userId)
    } catch{
        return
    }
    let returned = await countAndCalculate(userWishlistIds)

    res.status(200).render("pages/wishlist", { wishList: returned.detailedItems, cartTotalValue: returned.value })
})

router.get("/clearcart", async (req, res) => {
    console.log("user", req.session.userInfo, "is clearing cart.")
    console.log(req.session.userId)
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    try {
        await usersData.clearUserCart(userId)
    } catch{
        return
    }
    res.sendStatus(200)
})

router.get("/clearwishlist", async (req, res) => {
    console.log("user", req.session.userInfo, "is clearing cart.")
    console.log(req.session.userId)
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    try {
        await usersData.clearUserWishList(userId)
    } catch{
        return
    }
    res.sendStatus(200)
})

router.get("/checkout", async (req, res) => {
    console.log("user", req.session.userInfo, "is checking out.")
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    let user
    try {
        user = await usersData.getUserById(userId)
    } catch{
        return
    }
    let userShoppingCartIds = user.shoppingCart
    // if (typeof userShoppingCartIds == 'undefined' | userShoppingCartIds.length == 0) {
    //     console.log("error occurred when checking out.")
    //     // res.status(400).json({ errormessage: "Your cart is empty" })
    //     return
    // }
    let userShoppingCart = []
    let cartTotalValue = 0
    for (let id of userShoppingCartIds) {
        let item = await productsData.getProductById(id)
        userShoppingCart.push(item)
        cartTotalValue += item.price
    }
    delete user._id
    res.status(200).render("pages/checkout", { userAddress: user.address, cartList: userShoppingCart, cartTotalValue: cartTotalValue })
})

router.get("/orderplaced", async (req, res) => {
    console.log("user", req.session.userInfo, "is placing order.")
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    let user
    try {
        user = await usersData.getUserById(userId)
    } catch{
        return
    }
    let userShoppingCartIds = user.shoppingCart
    let newOrder
    let orderTotalValue = 0
    for (let id of userShoppingCartIds) {
        let item = await productsData.getProductById(id)
        orderTotalValue += item.price
    }
    try {
        newOrder = await ordersData.addOrder(userId, userShoppingCartIds, orderTotalValue)
    } catch (e) {
        console.log(e)
        throw `error occured when placing order.`
    }
    //TODO:clear cart
    usersData.patchUser(userId, { "shoppingCart": [] })
    res.status(200).render("pages/orderplaced")
})

router.get("/orderhistory", async (req, res) => {
    console.log("user", req.session.userInfo, "is viewing order history.")
    let userId = req.session.userId
    if (!userId | typeof (userId) === "undefined") {
        res.redirect("/mainpage")
    }
    let user
    try {
        user = await usersData.getUserById(userId)
    } catch{
        return
    }
    let userOrderHistory = user.orderHistory
    let userDetailedOrderHistory = []
    for (let id of userOrderHistory) {
        let order = await ordersData.getOrdertById(id)
        let ordreDetailedProducts = []
        for (let productId of order.products) {
            let deteiledProduct = await productsData.getProductById(productId)
            ordreDetailedProducts.push(deteiledProduct)
        }
        order.products = ordreDetailedProducts
        userDetailedOrderHistory.push(order)
    }
    res.status(200).render("pages/orderhistory", { orderHistory: userDetailedOrderHistory })

})

module.exports = router;
