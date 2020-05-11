const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const usersData = require("./users")
const productsData = require("./products")

const ObjectId = require('mongodb').ObjectID;

// untilities
function checkStringInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'string') {
    throw `Warning[${functionName}]: String is expected for '${inputName}'. Get ${typeof value} instead.`
  }

  return value
}
function checkNumberInput(value, inputName, functionName) {
  if (typeof value == 'undefined') {
    throw `Warning[${functionName}]: '${inputName}' is missing.`
  }
  else if (typeof value != 'number') {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get ${typeof value} instead.`
  }
  else if (isNaN(value)) {
    throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get NaN instead.`
  } else if (value < 0 | value > 5) {
    throw `Warning[${functionName}]: '${inputName}' can not be negative or greater than 5.`
  }
  return value
}
module.exports = {
  async addComment(content, userId, productId, rating) {
    checkStringInput(content, "content", "addComment")
    checkNumberInput(rating, "rating", "addComment")
    if (!userId) throw "must provide user Id to add comment."

    const newComment = {
      content: content,
      userId: userId,
      rating: rating
    }
    const commentsCollection = await comments();
    const insertInfo = await commentsCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw 'Could not add comment.';
    const newId = insertInfo.insertedId;
    const comment = await this.getCommentById(newId);

    //update relevant instances
    let user, product
    try {
      user = await usersData.getUserById(ObjectId(userId))
      product = await productsData.getProductById(productId)

    } catch{
      throw `Unable to fetch user or product for commenting.`
    }

    let userReviews = user.reviews
    userReviews.push(newId)
    try {
      await usersData.patchUser(userId, { "reviews": userReviews })
    } catch{
      throw `unable to add comment.`
    }
    let productReviews = product.reviews
    productReviews.push(newId)
    console.log(productReviews)
    try {
      await productsData.patchProduct(productId, { "reviews": productReviews })
    } catch{
      throw `unable to add comment.`
    }

    console.log("Comment has been posted by user:", user.basicInfo.username)
    return comment;
  },

  async getCommentById(id) {
    if (!id) throw 'You must provide an id to search for';
    const commentsCollection = await comments();
    const comment = await commentsCollection.findOne({ _id: ObjectId(id) });
    if (comment === null) throw 'No user with that id';
    return comment;
  },
  //input: array of ids output:detailed ones
  async substantiate(ids) {
    let returnedList = []
    for (let id of ids) {
      let comment = await this.getCommentById(id)
      let user = await usersData.getUserById(comment.userId)
      comment.commenter =user.basicInfo.username
        returnedList.push(comment)
    }
    return returnedList
  },

  //   async patchComment(id, patchObject) {
  //     if (!patchObject) throw 'You must provide an object to patch band';
  //     const commentsCollection = await comments();

  //     const updatedInfo = await commentsCollection.updateOne({ _id: ObjectId(id) }, { $set: patchObject });
  //     if (updatedInfo.modifiedCount === 0) {
  //         // nothing changed would cause failure
  //         // throw 'could not update band successfully. Nothing changed?';
  //         return null
  //     }

  //     return await this.getCommentById(id);
  // },
}