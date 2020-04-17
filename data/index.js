const usersData = require("./users");
const productsData = require("./products");
const commentsData = require("./comments");
const categoryData = require("./category");
const ordersData = require("./orders");

const dbConnection = require('../config/mongoConnection');
// const data = require('./data/');
// const bandsData = data.bands;
// const albumsData = data.albums
//test cases
const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    let basicInfo = {
        lastName: "ma",
        firstName: "dongming",
        birthdate: "101010101"
    }
    let address = {
        state: "NJ",
        city: "Hoboken",
        street: "9999999",
        zipCode: "114514"
    }
    let test = await usersData.addUser(basicInfo,"123@123.com","weyywy")
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
