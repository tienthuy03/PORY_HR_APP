import axios from 'axios';
import 'react-native-get-random-values';
import CryptoJS from "crypto-js";
import { deviceId } from '../../constants';

const sysFetch = (api, data, token) => {
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Key và IV cố định, nên đồng bộ với phía C#
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32 bytes cho AES-256
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 bytes cho AES block size

  // ✅ Mã hóa AES không salted
  const encrypted = CryptoJS.AES.encrypt(data.pro, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const cryptoString = encrypted.ciphertext.toString(CryptoJS.enc.Base64); // chỉ mã hóa phần "ciphertext" (không salt)

  // Gán chuỗi mã hóa vào data.pro mà không encode lại
  data.pro = cryptoString;

  return axios
    .post(
      api + 'Exec/MOBILE_DECRYPT/',
      {
        ...data,
        machine_id: deviceId,
        token: 'phr',
      },
      axiosConfig
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      if (err.response?.status === 401) {
        return 'Token Expired';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else if (err.response?.status >= 500) {
        throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else if (err.response?.status >= 400) {
        throw new Error('Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else {
        throw new Error('Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại.');
      }
    });
};

export default sysFetch;
