import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Info from 'react-native-device-info';
import {STORAGE_HOST} from '../storage/keys';
import {URL_API_TAKE_ABSENT} from './keys';

export default class Absent {
  constructor({rakerQrcode, raker, phoneKey, data}) {
    this.rakerQrcode = rakerQrcode;
    this.raker = raker;
    this.phoneKey = phoneKey;
    this.data = null;
  }

  static take = async (raker, rakerQrcode) => {
    let phoneKey = Info.getUniqueId();

    let host = await AsyncStorage.getItem(STORAGE_HOST);

    let {
      data: {data},
    } = await Axios.post(host + URL_API_TAKE_ABSENT, {
      raker,
      raker_qrcode: rakerQrcode,
      phone_key: phoneKey,
    });

    let absent = new Absent({data, phoneKey, raker, rakerQrcode});
  };
}
