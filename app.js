const express = require("express");
const path = require("path")
const exphbs = require("express-handlebars")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const configRoutes = require("./routes");


const app = express();
app.use("/static", express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
//handling syntax error throwed by body-parser
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).send({ status: 400, message: "Invalid json recieved." })
  } else {
    next();
  }
});
app.engine("hbs", exphbs({
  extname: '.hbs',
  defaultLayout: "main",
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, '/views'))
app.use(
  session({
    name: 'AuthCookie',
    secret: "Operation Aegis",
    saveUninitialized: true,
    resave: false
  })
);
//TODO: implement "remember me" check box logic here
app.use(async (req, res, next) => {
  // console.log("cookie",res.cookie('userInfo',))
  // res.cookie('userInfo',"test")
  if (req.session.userInfo) {
    res.cookie('userInfo',req.session.userInfo)
  }else{
    res.clearCookie("userInfo")
  }
  next()
})
//logging - uesless for now
// app.use(async (req, res, next) => {
//   const time = new Date().toUTCString()
//   const authen = req.session.isAuthenticated ? "Authenticated" : "Non-Authenticated"
//   console.log(`[${time}]: ${req.method} ${req.originalUrl} ${authen} user`)
//   next()
// })
// exphbs.registerPartials(__dirname+'/views/partials')

configRoutes(app);

// const dbConnection = require('./config/mongoConnection');
// const data = require('./data/');

//test cases
const main = async () => {
  // const db = await dbConnection();
  // await db.dropDatabase();
  //  console.log('Done seeding database');
};
// main().catch((error) => {
//   console.log(error);
// });
app.listen(3000, () => {
  console.log("Initialization successed.");
  console.log("Routes is running on http://localhost:3000");
});
