import Axios from 'axios';
import { Toast } from 'native-base';
import Info from 'react-native-device-info';
import { URL_API_TAKE_ABSENT, URL_API_TAKE_ABSENT_EXTERNAL } from './keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST } from '../../app.config'

export default class Absent {
  constructor({ rakerQrcode, raker, phoneKey, data }) {
    this.rakerQrcode = rakerQrcode;
    this.raker = raker;
    this.phoneKey = phoneKey;
    this.data = null;
  }

  static take = async (nip, raker, rakerQrcode) => {
    let phoneKey = Info.getUniqueId();

    const baseURL = (await AsyncStorage.getItem('HOST')) ?? HOST;

    let {
      data: { data },
    } = await Axios.post(URL_API_TAKE_ABSENT, {
      nip,
      raker,
      raker_qrcode: rakerQrcode,
      phone_key: phoneKey,
    }, {
      baseURL
    });

    let absent = new Absent({ data, phoneKey, raker, rakerQrcode });
  };
}
