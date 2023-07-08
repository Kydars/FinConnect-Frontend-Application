import axios from 'axios';
//const API_URL = 'https://ai8nyjlwr6.execute-api.ap-southeast-2.amazonaws.com/';

class ZuluService {
  initCompanyList(param) {
    //console.log(param)
    // const body = param.body
    // const header = param.header
    return axios.post(`/F12A_ZULU/fetch`, param.body,{
        headers : param.header
    });
  }
}

// eslint-disable-next-line  
export default new ZuluService();