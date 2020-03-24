const express = require("express");
const app = express();
const configRoutes = require("./routes");
app.use(express.json());
//handling syntax error throwed by body-parser
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).send({ status: 400, message: "Invalid json recieved." })
  } else {
    next();
  }
});
configRoutes(app);

const dbConnection = require('./config/mongoConnection');
const data = require('./data/');

//test cases
const main = async () => {
  // const db = await dbConnection();
  // await db.dropDatabase();
 console.log('Done seeding database');
};
// main().catch((error) => {
//   console.log(error);
// });
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
