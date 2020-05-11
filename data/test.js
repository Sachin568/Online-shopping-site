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
  // await db.dropDatabase();
  let basicInfo = {
    username: "DIO",
    birthdate: "101010101"
  }
  let address1 = {
    state: "gwg",
    city: "wgw",
    street: "wgw",
    zipCode: "ww"
  }

  let email = "123@123.com"

  let u1 = await usersData.addUser(basicInfo, email, "wry")
  let u11 = await usersData.updateUser(String(u1._id),"shffhh",u1.address)
  // address1.state = "awikjghui"
  // let u12 = await usersData.updateUser(u11._id,email,address1)
  // let u2 = await usersData.addUser(basicInfo, "asjfabf", "wry")
  // let u11 = await usersData.patchUser(u1._id,{"email":"sifwfiuwgbi"})
  // let p1 = await productsData.addProduct("tea", "tea", 29.99, "make your friend fall asleep", "static/imgs/green-tea-pouring-cup.jpg")
  // let p2 = await productsData.addProduct("lethargic tea", "tea", 49.99, "make your friend fall asleep in 3 seconds", "static/imgs/green-tea-pouring-cup.jpg")
  // let p3 = await productsData.addProduct("lethargic tea 野獣先輩 limited edition", "tea", 114.514, "イキスギイクゥ！イクイクゥ！ンアッー！", "static/imgs/野兽先辈.jpg")
  // let c1 = await commentsData.addComment("wtf is this", u1._id, 1)
  // let c2 = await commentsData.addComment("wtf is this???", u1._id, 0.1)
  // let o1  = await ordersData.addOrder(u1._id,[p1._id,p2._id])
  // await productsData.addProductToCart(u1._id,p1._id)

  // let u11 = await usersData.getUserById(u1._id)
  console.log("result:",u11)
};
main().catch((error) => {
  console.log(error);
});
