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
      pic: pic,
      reviews: []
    };

    const insertInfo = await productCollection.insertOne(newProduct);
    if (insertInfo.insertedCount === 0) throw 'Could not add product';
    const newId = insertInfo.insertedId;
    const prod = await this.getProductById(newId);
    console.log("Product has been added:", newProduct)
    return prod;
  },

  async getAllProducts(limit, skip) {
    const productCollection = await products();
    // discarded fancy pipeline, using two queries instead
    // const productList = await productCollection.aggregate([
    // ])
    let listSize = await productCollection.find({}).toArray();
    listSize = listSize.length
    const productList = await productCollection.find({}).skip(skip).limit(limit).toArray();
    const itemCount = productList.length
    return { productList: productList, listSize: listSize, itemCount: itemCount };
  },

  async searchProductByName(name, limit, skip) {
    const productCollection = await products();

    let listSize = await productCollection.find({ "name": { $regex: `.*${name}.*` } }).toArray();
    listSize = listSize.length

    if (!name) {
      throw "must provide a name for searching"
    } else {
      const productList = await productCollection.find({ "name": { $regex: `.*${name}.*` } }).skip(skip).limit(limit).toArray();
      const itemCount = productList.length
      if (productList === null) throw 'No products with that name';
      return { productList: productList, listSize: listSize, itemCount: itemCount }
    }
  },
  //temporary added
  async searchProductByCategory(category, limit, skip) {
    const productCollection = await products();

    let listSize = await productCollection.find({ "description.category": category }).toArray();
    listSize = listSize.length

    if (!category) {
      throw "must provide a category for searching"
    } else {
      const productList = await productCollection.find({ "category": category }).skip(skip).limit(limit).toArray();
      const itemCount = productList.length
      if (productList === null) throw 'No products with that name';
      return { productList: productList, listSize: listSize, itemCount: itemCount }
    }
  },
  //temporary added
  async searchProductByNameAndCategory(name, category, limit, skip) {
    const productCollection = await products();

    let listSize = await productCollection.find({ "name": { $regex: `.*${name}.*` }, "description.category": category }).toArray();
    listSize = listSize.length

    if (!name) {
      throw "must provide a name for searching"
    } else {
      const productList = await productCollection.find({ "name": { $regex: `.*${name}.*` }, "category": category }).skip(skip).limit(limit).toArray();
      const itemCount = productList.length
      if (productList === null) throw 'No products with that name';
      return { productList: productList, listSize: listSize, itemCount: itemCount }
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
      pic: pic,
      reviews: []
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

  async patchProduct(id, patchObject) {
    if (!patchObject) throw 'You must provide an object to patch band';
    const productCollection = await products();

    const updatedInfo = await productCollection.updateOne({ _id: ObjectId(id) }, { $set: patchObject });
    if (updatedInfo.modifiedCount === 0) {
      // nothing changed would cause failure
      // throw 'could not update band successfully. Nothing changed?';
      return null
    }

    return await this.getProductById(id);
  },

  // TODO:check authentication
  async addProductToCart(userId, productId) {
    let user, product
    try {
      user = await users.getUserById(userId)
      product = await this.getProductById(productId)
    } catch{
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
  },
  async addProductToWishlist(userId, productId) {
    let user, product
    try {
      user = await users.getUserById(userId)
      product = await this.getProductById(productId)
    } catch{
      throw `Ids not valid`
    }
    let updatedShoppingCart = user.shoppingCart
    updatedShoppingCart.push(productId)
    try {
      users.patchUser(userId, { "wishList": updatedShoppingCart })
    } catch{
      throw `unable to add product to wishList.`
    }
    console.log(`Product ${product.name} has been added to user ${user.basicInfo.username}'s wishList.`)
  }
}


// just to insert a new field
// const main = async () => {
//   const productCollection = await products();
//   let allp = await productCollection.updateMany({},
//     { $set: { "reviews": [] } },
//     {
//       upsert: false,
//       multi: true
//     }
//   )
//   allp =  await productCollection.find({}).toArray()
//   console.log(allp)
// }
// main().catch((error) => {
//   console.log(error);
// });