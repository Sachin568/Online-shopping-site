const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const ObjectId = require('mongodb').ObjectID;
const users = require("./users")


// untilities
function checkStringInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'string') {
    throw `Warning[${functionName}]: String is expected for '${inputName}'. Got ${typeof value} instead.`
  }
  return value
}

function checkNumberInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'number') {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Got ${typeof value} instead.`
  }
  else if (isNaN(value)) {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Got NaN instead.`
  } 
  else if (value <= 0) {
    throw `Warning[${functionName}]: '${inputName}' can not be 0 or negative number.`
  }
  return value
}

function checkObjectInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'object') {
    throw `Warning[${functionName}]: Object is expected for '${inputName}'. Got ${typeof value} instead.`
  }
  return value
}


module.exports = {
  async addProduct(name, category, price, description, pic) {
    const inputs = [name, category, pic]
    const inputsname = ["name", "category", "pic"]
    for (i = 0; i < inputs.length; i++) {
      checkStringInput(inputs[i], inputsname[i], 'addProduct')
    }
    checkNumberInput(price, "price", "addProduct")
    checkObjectInput(description, "description", "addProduct")
    const productCollection = await products();

    let newProduct = {
      name: name,
      category: category,
      price: price,
      description: description,
      pic: pic
    };

    const insertInfo = await productCollection.insertOne(newProduct);
    if (insertInfo.insertedCount === 0) throw 'Could not add product';
    const newId = insertInfo.insertedId;
    const prod = await this.getProductById(newId);
    console.log("Product has been added:", newProduct)
    return prod;
  },

  async getAllProducts() {
    const productCollection = await products();
    const productList = await productCollection.find({}).toArray();
    return productList;
  },

  async searchProductByName(name) {
    const productCollection = await products();

    if (!name) {
      return await this.getAllProducts()
    } else {
      const products = await productCollection.find({ "name": { $regex: `.*${name}.*` } }).toArray();
      if (products === null) throw 'No products with that name';
      return products
    }
  },

  async getProductById(id) {
    if (!id) throw 'You must provide an id to search for';

    const productCollection = await products();

    const product = await productCollection.findOne({ _id: ObjectId(id) });
    if (product === null) throw 'No product with that id';

    return product;
  },

  async updateProduct(id, name, category, price, description, pic) {
    if (!id) throw 'You must provide an id to update product';
    const inputs = [name, category, pic]
    const inputsname = ["name", "category", "pic"]
    for (i = 0; i < inputs.length; i++) {
      checkStringInput(inputs[i], inputsname[i], 'addProduct')
    }
    checkNumberInput(price, "price", "addProduct")
    checkObjectInput(description, "description", "addProduct")
    const productCollection = await products();
    let newProduct = {
      name: name,
      category: category,
      price: price,
      description: description,
      pic: pic
    };
    const updatedInfo = await productCollection.updateOne({ _id: id }, { $set: newProduct });
    if (updatedInfo.modifiedCount === 0) {
      throw 'Could not update product successfully.';
    }
    console.log("update successfully.")

    return await this.getProductById(id);
  },

  async removeProduct(id) {
    if (!id) throw 'You must provide an id to delete product';

    const productCollection = await products();
    const removedProduct = await this.getProductById(ObjectId(id))
    const deletionInfo = await productCollection.removeOne({ _id: ObjectId(id) });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete product with id of ${id}`;
    }
    console.log("remove successfully")
    return removedProduct
  },

  // TODO:check authentication
  async addProductToCart(userId, productId) {
    let user, product
    try{
      user = await users.getUserById(userId)
      product = await this.getProductById(productId)
    }catch{
      throw `Ids not valid`
    }
    let updatedShoppingCart = user.shoppingCart
    updatedShoppingCart.push(productId)
    try {
      users.patchUser(userId, { "shoppingCart": updatedShoppingCart })
    } catch{
      throw `unable to add product to cart.`
    }
    console.log(`Product ${product.name} has been added to user ${user.basicInfo.username}'s cart.`)
  }
}
