import axios from 'axios';
import {Toast} from 'native-base';
import {URL_API_GET_RAPAT} from './keys';

export default class Meting {
  static get = idRapat => {
    return axios.get(URL_API_GET_RAPAT(idRapat)).catch(error => {
      if (error?.response?.status) {
        const {
          status,
          data: {message, errors, data},
        } = error.response;

        Toast.show({
          title: message,
          background: 'red.400',
        });
      }

      throw error;
    });
  };
}
