const reqBody = (req) => req.body;
const reqQuery = (req) => req.query;

module.exports = (inputMode) => {
  switch(inputMode){
    case undefined:
    case 'body':
      return reqBody;
    case 'query':
      return reqQuery;
    default:
      if(typeof(inputMode) !== 'function')
        throw 'Invalid inputMode "' + inputMode + '"';
      return inputMode;
  }
};
