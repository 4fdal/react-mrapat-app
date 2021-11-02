import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Info from 'react-native-device-info';
import {STORAGE_HOST} from '../storage/keys';
import {URL_API_CHANGE_PASSWORD, URL_API_CHANGE_PROFILE} from './keys';

export class User {
  static async change({email_pegawai, no_telpon}) {
    let phoneKey = Info.getUniqueId();

    let host = await AsyncStorage.getItem(STORAGE_HOST);

    let url = URL_API_CHANGE_PROFILE.replace(/:phoneKey/g, phoneKey);

    return await Axios.post(host + url, {email_pegawai, no_telpon});
  }
  static async changePassword({password_lama, password_baru}) {
    let phoneKey = Info.getUniqueId();

    let host = await AsyncStorage.getItem(STORAGE_HOST);

    let url = URL_API_CHANGE_PASSWORD.replace(/:phoneKey/g, phoneKey);

    return await Axios.post(host + url, {password_lama, password_baru});
  }
}
