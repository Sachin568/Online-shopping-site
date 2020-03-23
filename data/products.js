const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
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
    } else if (value <= 0) {
      throw `Warning[${functionName}]: '${inputName}' can not be 0 or negative number.`
    }
    return value
  }