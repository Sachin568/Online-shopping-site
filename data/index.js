const userData = require("./users");
const productData = require("./products");
const commentData = require("./comments");
const categoryData = require("./category");
const orderData = require("./orders");

module.exports = {
    users: userData,
    products: productData,
    comments: commentData,
    category: categoryData,
    order: orderData
};
