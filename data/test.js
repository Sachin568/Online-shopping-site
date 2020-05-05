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
  let p1 = await productsData.addProduct("tea", "tea", 29.99, "make your friend fall asleep", "static/imgs/green-tea-pouring-cup.jpg")
  let p2 = await productsData.addProduct("lethargic tea", "tea", 49.99, "make your friend fall asleep in 3 seconds", "static/imgs/green-tea-pouring-cup.jpg")
  let p3 = await productsData.addProduct("lethargic tea 野獣先輩 limited edition", "tea", 114.514, "イキスギイクゥ！イクイクゥ！ンアッー！", "static/imgs/野兽先辈.jpg")
  const ppp = await productsData.searchProductByName("lethargic")
  console.log(ppp)

};
main().catch((error) => {
  console.log(error);
});
