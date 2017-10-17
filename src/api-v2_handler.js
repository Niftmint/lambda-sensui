'use strict'

const RelayHandler = require('./api-v2/relay');

const EthereumMgr = require('./lib/ethereumMgr');

let ethereumMgr = new EthereumMgr(process.env.PG_URL);

let relayHandler = new RelayHandler(ethereumMgr);

module.exports.fund = (event, context, callback) => {
  console.log(event)
  //console.log(event.body)
  let body;
  try{ body = JSON.parse(event.body) } catch(e){console.log(e);body={}}
  relayHandler.handle(body,(err,resp)=>{
    let response;
    if(err==null){
      response = {
          statusCode: 200,
          body: JSON.stringify({
            status: 'success',
            data: resp
          })
        }
    }else{
      //console.log(err);
      let code=500;
      if(err.code) code=err.code;
      let message=err;
      if(err.message) message=err.message;

      response = {
        statusCode: code,
        body: JSON.stringify({
          status: 'error',
          message: message
        })
      }
    }
    console.log("Response:"+JSON.stringify(response))
    callback(null, response)
  })

}
