const usersData = require("./users");
const productsData = require("./products");
const commentsData = require("./comments");
const categoryData = require("./category");
const ordersData = require("./orders");
// test
const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;


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
  // let u11 = await usersData.patchUser(u1._id,{"email":"sifwfiuwgbi"})
  let c1 = await commentsData.addComment("wtf is this",u1._id,1)
  let c2 = await commentsData.addComment("wtf is this???",u1._id,0.1)

  let u11 = await usersData.getUserById(u1._id)
  console.log(u11)
};
main().catch((error) => {
  console.log(error);
});
