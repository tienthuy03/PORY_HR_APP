import DefaultPreference from 'react-native-default-preference';
import { ipServer, nameApi } from '../config/Pro';
import axios from 'axios';
import { select } from '@redux-saga/core/effects';
import ShowError from '../services/errors';

var p_nameapi;
var p_dbname;
var p_dbuser;
var p_dbpass;

DefaultPreference.getAll().then(function (valueAll) {
  p_nameapi = valueAll.nameapi || nameApi;
  p_dbname = valueAll.namedb;
  p_dbuser = valueAll.userdb;
  p_dbpass = valueAll.passdb;
});

export const getValueConnect = () => {
  try {
    DefaultPreference.getAll().then(function (valueAll) {
      p_nameapi = valueAll.nameapi || nameApi.trim();
      p_dbname = valueAll.namedb;
      p_dbuser = valueAll.userdb;
      p_dbpass = valueAll.passdb;
    });
  } catch (error) {
    console.log('ERROR FETCH--->:' + error);
  }
};

export function getDataJson(URL, procedure, token) {
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .post(URL + 'Exec/MOBILE/', procedure, axiosConfig)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      if (err == 'AxiosError: Request failed with status code 401') {
        return 'Token Expired';
      } else {
        console.log('err fetch');
        console.log(err);
      }
    });
}

function getData(API_URL, procedure) {
  const rs = axios
    .post(API_URL + 'Exec2/MOBILEAPP/', procedure)
    .then(response => response.data)
    .catch(err => { });
  return rs;
}

export function getPass(API, user_id) {
  // const URL = 'http://' + ipServer + 'User/ResetPassword';
  // const URL = yield select(
  //   (state) => state.SysConfigReducer.API_URL + 'User/ResetPassword',
  // );
  let params = {
    user_id: user_id,
  };

  const rs = axios
    .post(API + 'User/ResetPassword', params)
    .then(response => {
      return response.data;
    })
    .catch(() => { });
  return rs;
}
export function sendMail(API, user_id, email, deviceId) {
  // const mURL = 'http://' + ipServer + 'SendMail/Basic/';
  // const mURL = yield select(
  //   (state) => state.SysConfigReducer.API_URL + 'SendMail/Basic/',
  // );
  const result = getData(API, {
    pro: 'UPDREPW0010100',
    in_par: {
      p1_varchar2: user_id,
      p2_varchar2: '033490d972785fea5651a117478af886',
    },
    out_par: {
      p1_varchar2: 'alert',
      p2_varchar2: 'status',
    },
    token: 'phr',
    machine_id: deviceId,
  }).then(res => {
    if (res.data.status === 'Y') {
      let mParam = {
        FromP: 'Hoa Phat Dung Quat Support',
        FromM: 'support.hr@hoaphat.com.vn',
        FromPass: 'hpg@2021',
        ToM: email,
        ToP: user_id,
        Subject: 'Reset',
        BodyContent:
          '<div><h1>LẤY LẠI MẬT KHẨU</h1><hr><h4>Chào ' +
          user_id +
          "!</h4><p>Mật khẩu mới từ hệ thống Hoà Phát Dung Quất là:</p><div style='background-color: #3699FF; padding:20px; width:100%; color: white; text-align: center;'>" +
          res.data.content +
          "</div><p>Hãy đăng nhập vào hệ thống và thay đổi mật khẩu mới.</p><div style='text-align: right;'><strong>Thân chào!</strong></div></div>",
        SmtpServer: 'mail.hoaphat.com.vn',
        SmtpPort: '25',
      };
      return axios
        .post(API + 'SendMail/Basic/', mParam)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error);
          ShowError(error.toString());
        });
    } else {
    }
  });
  return result;
}
export { getData };
