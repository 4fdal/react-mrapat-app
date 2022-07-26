import Axios from 'axios';
import {Toast} from 'native-base';
import Info from 'react-native-device-info';
import AbsensiExternalParticipantScreen from '../screens/Absent/AbsensiExternalParticipantScreen';
import {URL_API_TAKE_ABSENT, URL_API_TAKE_ABSENT_EXTERNAL} from './keys';

export default class Absent {
  constructor({rakerQrcode, raker, phoneKey, data}) {
    this.rakerQrcode = rakerQrcode;
    this.raker = raker;
    this.phoneKey = phoneKey;
    this.data = null;
  }

  static take = async (raker, rakerQrcode) => {
    let phoneKey = Info.getUniqueId();

    let {
      data: {data},
    } = await Axios.post(URL_API_TAKE_ABSENT, {
      raker,
      raker_qrcode: rakerQrcode,
      phone_key: phoneKey,
    });

    let absent = new Absent({data, phoneKey, raker, rakerQrcode});
  };

  /**
   *
   *
   * @static
   * @param {AbsensiExternalParticipantScreen} screen
   * @param {{ id_rapat, nama_perusahaan, nama, jabatan, email, no_telpon }} dataBody
   * @memberof Absent
   */
  static takeExternal = async (screen, dataBody) => {
    screen.setState({
      formValidate: {
        id_rapat: null,
        nama_perusahaan: null,
        nama: null,
        jabatan: null,
        email: null,
        no_telpon: null,
      },
    });

    const formValidate = screen.state.formValidate;

    try {
      let {data} = await Axios.post(URL_API_TAKE_ABSENT_EXTERNAL, dataBody);

      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status == 422) {
          const errors = error.response.data.errors;
          for (const key in errors) {
            const [errMessage] = errors[key];
            formValidate[key] = errMessage;
          }

          if (formValidate.email != null && formValidate.no_telpon != null) {
            Toast.show({
              title: 'Perserta rapat telah melakukan absensi sebelumnya',
            });
          }

          screen.setState({formValidate});

          throw error;
        }
      }
    }
  };
}
