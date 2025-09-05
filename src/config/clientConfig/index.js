import AsyncStorage from "@react-native-async-storage/async-storage";
export const APP_VERSION = "1.0.0";
export const ServerIP = {
  phr: "http://115.73.215.94:8082/new_api/api/",
};
export const configAPI = [
  {
    API_NAME: "http://115.73.215.94:8082/new_api/api/",
    CLIENT_ID: "SYSHR",
    CLIENT_KEY: "syshr@2025",
  },

];

export const ClientIdDefault = "PORYHR";
export const buildFor = "phr";

export const ipServer = () => {
  const url = AsyncStorage.getItem("API_URL");
  let temp = ServerIP.phr;
  console.log(" ************** url api_url ", url);
  if (url === null) {
    AsyncStorage.setItem("API_URL", ServerIP.phr);
  } else {
    temp = url;
  }
  return temp;
};
export const nameApi = "TsMobileAPI.asmx";
