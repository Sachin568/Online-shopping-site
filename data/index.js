const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');

const data = require('./seed_data/');
// const usersData = require("../data/users");
const productsData = require("../data/products");
// const commentsData = require("../data/comments");
// const categoryData = require("../data/category");
// const ordersData = require("../data/orders");
// const users = mongoCollections.users;


const main = async () => {
    const db = await dbConnection();
    const fs = require('fs');
    let groceryData = fs.readFileSync('products_data.json');  
    let grocery = JSON.parse(groceryData);  
    db.Final_Project.insertMany(grocery);
    // console.log(cities);
    await db.serverConfig.close();
};
main().catch((error) => {
    console.log(error);
});

module.exports = {
    // users: usersData,
    products: productsData//,
    // comments: commentsData,
    // category: categoryData,
    // orders: ordersData
};