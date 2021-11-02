import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_LOGIN} from './keys';

export class Authenticate {
  constructor({phoneKey, nip, password, data}) {
    this.phoneKey = phoneKey;
    this.nip = nip;
    this.password = password;
    this.data = data;
  }

  store = async () => {
    let objectToString = JSON.stringify(this);
    await AsyncStorage.setItem(STORAGE_LOGIN, objectToString);

    return this;
  };

  static get = async () => {
    let stringToObject = JSON.parse(await AsyncStorage.getItem(STORAGE_LOGIN));
    return new Authenticate(stringToObject);
  };

  static logout = async () => {
    return await AsyncStorage.removeItem(STORAGE_LOGIN);
  };
}
