import * as qiniu from 'qiniu-js';
import haha from 'qiniu/index';

const crypto = require('crypto');

const getUploadToken = (putPolicy, accessKey, secretKey) => {
  let putPolicyString = JSON.stringify(putPolicy);
  let encodedPutPolicy = window.btoa(putPolicyString);

  const hash = crypto.createHmac('sha1', secretKey).update(encodedPutPolicy).digest('hex');
  let encodedHash = window.btoa(hash);
  let uploadToken = accessKey + ':' + encodedHash + ':' + encodedPutPolicy;
  return uploadToken;
}
const qiniuAPI = () => {
  var accessKey = '1onu7yWhC-cnKDKXpXb9qFTYLDXIIBtVGNOY_4i3';
  var secretKey = '5fx73jAMgIi3CVSryCNL4YxuRxuRne4bHy_vWQHO';
  const bucket = 'pwg-saas-images';
  
  return {
    upload: (file) => {
      let putPolicy = {
        scope: bucket,
        deadline: 1451491200
      }
      let uploadToken = getUploadToken(putPolicy, accessKey, secretKey);
console.log('uploadToken',uploadToken)

      var config = {
        // useCdnDomain: true,
        region: qiniu.region.z0
      };
      var putExtra = {
        fname: "",
        params: {},
        mimeType: ["image/png", "image/jpeg"]
      };
      let key = ''
      var observable = qiniu.upload(file, key, uploadToken, putExtra, config)
      var observer = {
        next(res){
          console.log('next(res)',res)
        },
        error(err){
          console.log('error(err)',err)
        }, 
        complete(res){
          console.log('complete(res)',res)
        }
      }
      var subscription = observable.subscribe(observer)
      // subscription.unsubscribe()
    },
    get: () => {
  
    },
    remove: () => {
  
    }
  }
}

export default qiniuAPI;