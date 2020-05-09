const mongoCollections = require('../config/mongoCollections');
const orders = mongoCollections.orders;
const ObjectId = require('mongodb').ObjectID;
const usersData = require("./users")


// untilities
function checkStringInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'string') {
    throw `Warning[${functionName}]: String is expected for '${inputName}'. Get ${typeof value} instead.`
  }

  return value
}
function checkNumberInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'number') {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get ${typeof value} instead.`
  }
  else if (isNaN(value)) {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get NaN instead.`
  } else if (value <= 0) {
    throw `Warning[${functionName}]: '${inputName}' can not be 0 or negative number.`
  }
  return value
}

function getCurrentTime() {
  let currentdate = new Date();
  currentdate = currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    return currentdate
}

module.exports = {
  async addOrder(userId, productList, value) {
    console.log(userId, productList)
    if (!userId) throw "[warning] must provide user Id to add order."
    if (productList.length == 0 | typeof productList == 'undefined') throw "cannot add roder with empty cart."
    let user
    try {
      user = await usersData.getUserById(userId)
    } catch{
      throw "no user with that id"
    }

    const ordersCollection = await orders();
    let newOrder = {
      userId: userId,
      products: productList,
      placedDate: getCurrentTime(),
      value:value

    }
    const insertInfo = await ordersCollection.insertOne(newOrder);
    if (insertInfo.insertedCount === 0) throw 'Could not add product';
    const newId = insertInfo.insertedId;

    let newUserOrderHistory = user.orderHistory
    newUserOrderHistory.push(newId)
    usersData.patchUser(userId, { "orderHistory": newUserOrderHistory })
    newOrder = await this.getOrdertById(newId);
    console.log("New order been added:", newOrder)
    return newOrder;
  },

  async getOrdertById(id) {
    if (!id) throw 'You must provide an id to search for';
    const ordersCollection = await orders();
    const order = await ordersCollection.findOne({ _id: ObjectId(id) });
    if (order === null) throw 'No user with that id';
    return order;
  }
}