const usersData = require("./users");
const productsData = require("./products");
const commentsData = require("./comments");
const ordersData = require("./orders");
const fs = require('fs')
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

  // fs.readFile('./products_data.json', (err, data) => {
  //   if (err) throw err;

  //   console.log(JSON.parse(data));
  // })
  // insert json in collection
  // const productCollection = await products();
  // let allp = await productCollection.updateMany({},
  //   { $set: { "reviews": [] } },
  //   {
  //     upsert: false,
  //     multi: true
  //   }
  // )
  // allp =  await productCollection.find({}).toArray()
  // console.log(allp)

  // let basicInfo = {
  //   username: "DIO",
  //   birthdate: "101010101"
  // }
  // let address1 = {
  //   state: "gwg",
  //   city: "wgw",
  //   street: "wgw",
  //   zipCode: "ww"
  // }

  // let email = "123@123.com"

  // let u1 = await usersData.addUser(basicInfo, email, "wry")
  // const comments = db.collection('comments').drop()
  // let u1 = await usersData.getUserByName('dio')
  // let p1 = await productsData.getProductById("5eb4a52b8c261c69a007d649")
  // await productsData.patchProduct(p1._id,{"reviews":[]})
  // let u11 = await usersData.updateUser(String(u1._id),"shffhh",u1.address)
  // address1.state = "awikjghui"
  // let u12 = await usersData.updateUser(u11._id,email,address1)
  // let u2 = await usersData.addUser(basicInfo, "asjfabf", "wry")
  // let u11 = await usersData.patchUser(u1._id,{"email":"sifwfiuwgbi"})
  // let p1 = await productsData.addProduct("tea", "tea", 29.99, {description:"make your friend fall asleep"}, "static/imgs/green-tea-pouring-cup.jpg")
  // let p2 = await productsData.addProduct("lethargic tea", "tea", 49.99, {description:"make your friend fall asleep in 3 seconds"}, "static/imgs/green-tea-pouring-cup.jpg")
  // let p3 = await productsData.addProduct("lethargic tea 野獣先輩 limited edition", "tea", 114.514, "イキスギイクゥ！イクイクゥ！ンアッー！", "static/imgs/野兽先辈.jpg")
  // let c1 = await commentsData.addComment("wtf is this", u1._id, 1)
  // let c2 = await commentsData.addComment("wtf is this???", u1._id, 0.1)
  // let o1  = await ordersData.addOrder(u1._id,[p1._id,p2._id])
  // await productsData.addProductToCart(u1._id,p1._id)
  // await usersData.clearUserCart(u1._id)
  // let c1 = await usersData.getUserCart(u1._id)


  // let co1 = await commentsData.addComment("gud", u1._id, "5eb4a52b8c261c69a007d649", 5)
  // let co2 = await commentsData.addComment("whoaaaaa", u1._id, "5eb4a52b8c261c69a007d649", 5)
  // p1 = await productsData.getProductById("5eb4a52b8c261c69a007d649")


  if (!/\S/.test("    ")) {
    console.log("Comment cannot be empty.")
}

};
main().catch((error) => {
  console.log(error);
});
