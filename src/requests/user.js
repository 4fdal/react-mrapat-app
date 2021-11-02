import Axios from 'axios';
import Info from 'react-native-device-info';
import {URL_API_CHANGE_PASSWORD, URL_API_CHANGE_PROFILE} from './keys';

export class User {
  static async change({email_pegawai, no_telpon}) {
    let phoneKey = Info.getUniqueId();
    let url = URL_API_CHANGE_PROFILE.replace(/:phoneKey/g, phoneKey);

    return await Axios.post(url, {email_pegawai, no_telpon});
  }
  static async changePassword({password_lama, password_baru}) {
    let phoneKey = Info.getUniqueId();
    let url = URL_API_CHANGE_PASSWORD.replace(/:phoneKey/g, phoneKey);

    return await Axios.post(url, {password_lama, password_baru});
  }
}
