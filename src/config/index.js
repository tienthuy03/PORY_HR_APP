import DeviceInfo from "react-native-device-info";
export const GET_USER = "GET_USER";
export const deviceId = DeviceInfo.getUniqueId();
export const deviceName = DeviceInfo.getDeviceName();

export const RICE_TYPE_LIST = [
  { label: "Basmati", value: "Basmati" },
  { label: "Non-Basmati", value: "Non-Basmati" },
];

