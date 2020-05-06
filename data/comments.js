const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const userDBApi = require("./users");
const productDBApi = require("./products");
const ObjectId = require('mongodb').ObjectID;

// untilities
function checkStringInput(value, inputName, functionName) {
    if (typeof value == 'undefined') {
      throw `Warning[${functionName}]: '${inputName}' is missing.`
    }
    else if (typeof value != 'string' || value === '') {
      throw `Warning[${functionName}]: String is expected for '${inputName}'. Get ${typeof value} instead.`
    }
  
    return value
  }

  function checkDBIdInput(value, inputName, functionName) {
    if (typeof value == 'undefined') {
      throw `Warning[${functionName}]: '${inputName}' is missing.`
    }
    else if (typeof value != 'string' || typeof value != 'object') {
      throw `Warning[${functionName}]: String or ObjectId is expected for '${inputName}'. Got ${typeof value} instead.`
    }

    if(typeof value != 'string')
      value = ObjectId(value);
  
    return value
  }

  function checkNumberInput(value, inputName, functionName) {
    if (typeof value == 'undefined') {
      throw `Warning[${functionName}]: '${inputName}' is missing.`
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
      users.patchUser(userID, { "reviews": userReviews })
    } catch{
      throw `unable to add comment.`
    }
    return value
  }

module.exports = {
  async addComment(productId,userId,comment){
    productId = checkDBIdInput(productId,"productId","addComment");
    userId = checkDBIdInput(userId,"userId","addComment");
    checkStringInput(comment,"Comments","addComments");
    
    const user = await userDBApi.getUserById(userId);
    const product = await productDBApi.getProductById(productId);

    if(!user)
      throw "Warning[addComment]: user not found with the given ID.";

    if(!product)
      throw "Warning[addComment]: product not found with the given ID.";

    const comment = {
      username : user.username,
      comment : comment,
    }

    const commentsCollection = await comments();
    const insertInfo = await commentsCollection.insertOne(newProduct);
    if (insertInfo.insertedCount === 0) throw 'Warning[addComment]: Could not add Comment';
    const newCommentId = insertInfo.insertedId;

    product.comment.add(newCommentId);
    //productDBApi.updateProduct()  TODO : AddComment to product

  },
  async removeComment(commentId){
    commentId = checkDBIdInput(commentId,"commentId","removeComment");

    const commentsCollection = await comments();
    const removedComment = await this.getCommentById(commentId)

    const deletionInfo = await commentsCollection.removeOne({ _id:commentId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${commentId}`;
    }
    console.log("remove successfully");
    return removedComment;
  },async getCommentById(commentId) {
    commentId = checkDBIdInput(commentId,"commentId","removeComment");
    const commentsCollection = await comments();

    const comment = await commentsCollection.findOne({ _id: commentId});
    if (!comment)  throw "Warning[getCommentById]: comment not found with the given ID.";

    return comment;
  }

}