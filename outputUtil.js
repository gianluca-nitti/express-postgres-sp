const getAtomicResult = (result) => {
  if(result.rowCount === 1 && Object.keys(result.rows[0]).length === 1)
    return String(result.rows[0][Object.keys(result.rows[0])[0]]);
  throw 'An atomic result was expected, but query returned a multi-row or multi-column result';
};

const getSingleRowResult = (result) => {
  if(result.rowCount === 1)
    return result.rows[0];
  throw 'A single-row result was expected, but query returned a multi-row result';
};

const outRaw = (spName, result, res) => res.send(getAtomicResult(result));
const outJsonString = (spName, result, res) => res.json(JSON.parse(getAtomicResult(result)));
const outJsonRow = (spName, result, res) => res.json(getSingleRowResult(result));
const outJsonTable = (spName, result, res) => res.json(result.rows);
const outJsonRawResult = (spName, result, res) => res.json(result);
const outRenderFromJson = (spName, result, res) => {
  const locals = JSON.parse(getAtomicResult(result));
  if(typeof(locals) !== 'object')
    throw 'Only results of stored procedures returning a JSON string can be rendered';
  res.render(spName, locals);
};
const outRenderFromRow = (spName, result, res) => res.render(spName, getSingleRowResult(result));
const outRenderFromTable = (spName, result, res) => res.render(spName, result);
const outRedirectUrl = (spName, result, res) => res.redirect(getAtomicResult(result));
const outRedirectBack = (spName, result, res) => res.redirect('back');

module.exports = (outputMode) => {
  switch(outputMode){
    case undefined:
    case 'raw':
      return outRaw;
    case 'jsonString':
      return outJsonString;
    case 'jsonRow':
      return outJsonRow;
    case 'jsonTable':
      return outJsonTable;
    case 'jsonRawResult':
      return outJsonRawResult;
    case 'renderFromJson':
      return outRenderFromJson;
    case 'renderFromRow':
      return outRenderFromRow;
    case 'renderFromTable':
      return outRenderFromTable;
    case 'redirectUrl':
      return outRedirectUrl;
    case 'redirectBack':
      return outRedirectBack;
    default:
      if(typeof(outputMode) !== 'function')
        throw 'Invalid outputMode "' + outputMode + '"';
      return outputMode;
  }
};
