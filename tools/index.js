/*const HttpError = function(status, message) {
  Error.call(this);
  this.message = message || null;
  this.status = status;
}*/

const getBeautifulMongoError = (err, doc, next) => {
  const beautifulError = new Error();
  if (err.name == 'ValidationError') {
    for (let error in err.errors)
      beautifulError[error] = err.errors[error].message;
    next(beautifulError);
  }
  else if (err.code == 11000) {
    let field = err.errmsg
      .split('index: ')[1]
      .split(' dup key')[0];
    field = field.substring(0, field.lastIndexOf('_'));
    let value = err.errmsg
      .split('\"')[1];
    beautifulError[field] = `\'${value}\' is already exists`;
    next(beautifulError);
  }
    
  next(err);
}

module.exports = {
  getBeautifulMongoError
}