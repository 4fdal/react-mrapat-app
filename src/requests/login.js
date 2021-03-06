import Axios from 'axios';
import {Toast} from 'native-base';
import Info from 'react-native-device-info';
import {Authenticate} from '../storage/authenticate';
import {Profile} from '../storage/profile';
import {URL_API_LOGIN} from './keys';

export class Login {
  constructor({nip, password}) {
    this.nip = nip;
    this.password = password;
    this.response = {};
    this.data = {};
  }

  /**
   *
   *
   * @static
   * @param {{ nip : string, password : string }} loginBody
   *
   * @return {Promise<Login>} result
   * @memberof Login
   */
  static make = async ({nip, password}) => {
    try {
      let phoneKey = Info.getUniqueId();

      let login = new Login({nip, password});
      login.response = await Axios.post(URL_API_LOGIN, {
        nip,
        password,
        phone_key: phoneKey,
      });

      let {
        data: {data},
      } = login.response;

      let {pegawai} = data;

      // sync with local storage
      await new Authenticate({data, nip, password, phoneKey}).store();
      await new Profile(pegawai).store();

      login.data = data;

      return login;
    } catch (error) {
      throw error;
    }
  };
}
