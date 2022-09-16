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

  static take = async (nip, raker, rakerQrcode) => {
    let phoneKey = Info.getUniqueId();

    let {
      data: {data},
    } = await Axios.post(URL_API_TAKE_ABSENT, {
      nip,
      raker,
      raker_qrcode: rakerQrcode,
      phone_key: phoneKey,
    });

    return data;
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

            formValidate.email = null;
            formValidate.no_telpon = null;
          }

          screen.setState({formValidate});

          throw error;
        } else if (error.response.status == 400) {
          Toast.show({
            title: error.response.data.message,
            status: 'warning',
          });
        } else {
          Toast.show({
            title: error.response.data.message ?? 'Gagal mengambil absensi',
            status: 'error',
          });
        }
      } else {
        Toast.show({
          title: 'Gagal mengambil absent, silahkan periksa kembali id',
          description: error.message,
          status: 'error',
        });
      }

      throw error;
    }
  };
}
