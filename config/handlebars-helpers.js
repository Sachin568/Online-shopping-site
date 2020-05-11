module.exports = {
  json: function (obj) {
    return JSON.stringify(obj);
  },
  paginate: function (attr) {
    //pagination,options
    console.log(attr.hash,typeof(attr.hash))
    let pagination = attr.hash.pagination
    let options = attr.hash.options
    // console.log(JSON.parse(attr.hash))
    // attrs = JSON.parse(attrs)
    // let pagination = attrs
    var type = options || 'middle';
    var ret = '';
    var pageCount = Number(pagination.pageCount);
    var page = Number(pagination.page);
    var limit;
    if (options) limit = +options;

    //page pageCount
    var newContext = {};
    switch (type) {
      case 'middle':
        if (typeof limit === 'number') {
          var i = 0;
          var leftCount = Math.ceil(limit / 2) - 1;
          var rightCount = limit - leftCount - 1;
          if (page + rightCount > pageCount)
            leftCount = limit - (pageCount - page) - 1;
          if (page - leftCount < 1)
            leftCount = page - 1;
          var start = page - leftCount;

          while (i < limit && i < pageCount) {
            newContext = { n: start };
            if (start === page) newContext.active = true;
            ret = ret + options.fn(newContext);
            start++;
            i++;
          }
        }
        else {
          for (var i = 1; i <= pageCount; i++) {
            newContext = { n: i };
            if (i === page) newContext.active = true;
            ret = ret + options.fn(newContext);
          }
        }
        break;
      case 'previous':
        if (page === 1) {
          newContext = { disabled: true, n: 1 }
        }
        else {
          newContext = { n: page - 1 }
        }
        ret = ret + options.fn(newContext);
        break;
      case 'next':
        newContext = {};
        if (page === pageCount) {
          newContext = { disabled: true, n: pageCount }
        }
        else {
          newContext = { n: page + 1 }
        }
        ret = ret + options.fn(newContext);
        break;
      case 'first':
        if (page === 1) {
          newContext = { disabled: true, n: 1 }
        }
        else {
          newContext = { n: 1 }
        }
        ret = ret + options.fn(newContext);
        break;
      case 'last':
        if (page === pageCount) {
          newContext = { disabled: true, n: pageCount }
        }
        else {
          newContext = { n: pageCount }
        }
        ret = ret + options.fn(newContext);
        break;
    }
    console.log(String(ret))
    return ret;
  }
}