const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = require("./users")

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
  async addComment(content, userID, rating) {
    checkStringInput(content, "content", "addComment")
    checkNumberInput(rating, "rating", "addComment")
    if (!userID) throw "must provide user Id to add comment."
    // get user first then insert it into the user's comment field
    let user
    try {
      user = await users.getUserById(ObjectId(userID))
    } catch{
      throw `Unable to fetch user ${userID}`
    }

    const newComment = {
      content: content,
      userID: userID,
      rating: rating
    }
    const commentsCollection = await comments();
    const insertInfo = await commentsCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw 'Could not add comment.';
    const newId = insertInfo.insertedId;
    const comment = await this.getCommentById(newId);

    let userReviews = user.reviews
    userReviews.push(newId)
    try {
      await users.patchUser(userID, { "reviews": userReviews })
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
  }
}