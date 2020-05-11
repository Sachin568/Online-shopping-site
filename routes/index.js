const mainpageRoutes = require("./mainpage")
const usersRoutes = require("./users");
const testRoutes = require("./test");
const productsRoutes = require("./products");
const commentsRoutes = require("./comments")


const constructorMethod = app => {
  app.use("/mainpage", mainpageRoutes);
  app.use("/users", usersRoutes);
  app.use("/test",testRoutes);
  app.use("/products", productsRoutes);
  app.use("/comments",commentsRoutes)


  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
    // res.redirect("mainpage")
  });
};

module.exports = constructorMethod;
