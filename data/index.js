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

    let basicInfo = {
        username: "DIO",
        birthdate: "101010101"
    }
    let email = "123@123.com"

    let u1 = await usersData.addUser(basicInfo, email, "wry")
    let p1 = await productsData.addProduct("tea", "tea", 29.99, "make your friend fall asleep", "static/imgs/green-tea-pouring-cup.jpg")
    let p2 = await productsData.addProduct("lethargic tea", "tea", 49.99, "make your friend fall asleep in 3 seconds", "static/imgs/green-tea-pouring-cup.jpg")
    let p3 = await productsData.addProduct("lethargic tea 野獣先輩 limited edition", "tea", 114.514, "イキスギイクゥ！イクイクゥ！ンアッー！", "static/imgs/野兽先辈.jpg")
    let c1 = await commentsData.addComment(p1._id,u1._id,"wtf is this")
    let c2 = await commentsData.addComment(p2._id,u1._id,"wtf is this???")
    let u11 = await usersData.getUserById(u1._id)
    console.log(u11)

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
