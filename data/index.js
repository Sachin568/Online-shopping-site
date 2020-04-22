const usersData = require("./users");
const productsData = require("./products");
const commentsData = require("./comments");
const categoryData = require("./category");
const ordersData = require("./orders");
// test
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

// test
const dbConnection = require('../config/mongoConnection');
// const data = require('./data/');
// const bandsData = data.bands;
// const albumsData = data.albums
//test cases
const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const usersCollection = await users();

    let basicInfo = {
        username: "DIO",
        birthdate: "101010101"
    }
    let email = "123@123.com"
    let email2 = "321@123.com"
    // let address = {
    //     state: "NJ",
    //     city: "Hoboken",
    //     street: "9999999",
    //     zipCode: "114514"
    // }
    let test = await usersData.addUser(basicInfo,email,"wry")
    // console.log(test)
    // let test2 = await usersData.addUser(basicInfo,email2,"weyywy")
    // console.log(test2)

    // let user = await usersCollection.findOne({email:email})
    // console.log(user)
    // basicInfo.lastName = "JOJO"
    // let test1 = await usersData.patchUser(test._id,{basicInfo})
    // console.log(test.shoppingCart)
    // let allUsers = await usersData.getAllUsers()
    // console.log("all",allUsers)
};
main().catch((error) => {
    console.log(error);
});

module.exports = {
    users: usersData,
    products: productsData,
    comments: commentsData,
    category: categoryData,
    order: ordersData
};
