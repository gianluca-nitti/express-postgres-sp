const getAtomicResult = (result) => {
  if(result.rowCount === 1 && Object.keys(result.rows[0]).length === 1)
    return String(result.rows[0][Object.keys(result.rows[0])[0]]);
  throw 'An atomic result was expected, but query returned a multi-row or multi-column result';
};

const outRaw = (spName, result, res) => res.send(getAtomicResult(result));
const outJsonRows = (spName, result, res) => res.json(result.rows);
const outJsonString = (spName, result, res) => res.json(getAtomicResult(result));
const outRender = (spName, result, res) => res.render(spName, JSON.parse(getAtomicResult(result))); //TODO alternatively pass rows

module.exports = (outputMode) => {
  switch(outputMode){
    case undefined:
    case 'raw':
      return outRaw;
    //case undefined:
    case 'jsonRows':
      return outJsonRows;
    case 'jsonString':
      return outJsonString;
    case 'render':
      return outRender;
    default:
      if(typeof(outputMode) !== 'function')
        throw 'Invalid outputMode "' + outputMode + '"';
      return outputMode;
  }
};
