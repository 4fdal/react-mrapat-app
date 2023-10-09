import Axios from 'axios';
import Info from 'react-native-device-info';
import { URL_API_CHANGE_PASSWORD, URL_API_CHANGE_PROFILE } from './keys';
import { HOST } from '../../app.config'
import AsyncStorage from '@react-native-async-storage/async-storage';

export class User {
  static async change({ email_pegawai, no_telpon }) {
    let phoneKey = Info.getUniqueId();
    let url = URL_API_CHANGE_PROFILE.replace(/:phoneKey/g, phoneKey);
    const baseURL = (await AsyncStorage.getItem('HOST')) ?? HOST;

    return await Axios.post(url, { email_pegawai, no_telpon }, {
      baseURL
    });
  }
  static async changePassword({ password_lama, password_baru }) {
    let phoneKey = Info.getUniqueId();
    let url = URL_API_CHANGE_PASSWORD.replace(/:phoneKey/g, phoneKey);

    return await Axios.post(url, { password_lama, password_baru });
  }
}
