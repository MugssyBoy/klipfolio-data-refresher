// Author: Israel O.

const vo = require('vo');
const fs = require('fs');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

const dataRefresher = function * (datasourceId) {

  let url = 'https://app.klipfolio.com/datasources/view_refresh_log/'+datasourceId;
  yield nightmare.goto(url);
  yield nightmare.wait('body')
  
  let login = yield nightmare.exists('#form-login');
  
  
  if(login){
    yield nightmare.wait('#f-username')
    yield nightmare.type('#f-username','israel@outdoorequipped.com')
    yield nightmare.wait('#f-password')
    yield nightmare.type('#f-password','Smurf@t1234')
    yield nightmare.click('#login')
    yield nightmare.wait(5000)
    yield nightmare.goto(url);
  }

  
  yield nightmare.wait('.dataList')
  yield nightmare.click('a#refreshLink')
  yield nightmare.wait(9500)
//  yield nightmare.end()
    
    yield nightmare.catch(function(e)  {
            console.log(e);
    });

};


function run(index,datasourceId){
  
    if(index < datasourceId.length){
    
        vo(dataRefresher)(datasourceId[index],function(err,req,res) {
          if (err) {
            console.error('an error occurred: ' + err);
            run(index,datasourceId);
          }else{
            index++;
            run(index,datasourceId);
          }
      });
    }else{
      console.log('scraper done!');
    }
}
  
run(0,['82b5db3dc21f4cbbd65d4118c0fc62af','551a894e7d8faad7c724c6ae6a9044d6']);
// module.exports = run;