const usersRoutes = require("./users");
const productsRoutes = require("./products");


const constructorMethod = app => {
  // app.use("/mainpage", usersRoutes);
  app.use("/users", usersRoutes);
  // app.use("/products", productsRoutes);


  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
