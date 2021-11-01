import Axios from 'axios';
import Info from 'react-native-device-info';
import {Authenticate} from '../storage/authenticate';
import {URL_API_GET_BANNER, URL_API_LOGIN} from './keys';

export class Banner {
  constructor({
    id,
    nama,
    gambar,
    informasi_gambar,
    waktu_mulai_ditampilkan,
    waktu_selesai_ditampilkan,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.nama = nama;
    this.gambar = gambar;
    this.informasi_gambar = informasi_gambar;
    this.waktu_mulai_ditampilkan = waktu_mulai_ditampilkan;
    this.waktu_selesai_ditampilkan = waktu_selesai_ditampilkan;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   *
   * @returns banners Promise<Banner>
   */
  static make = async () => {
    let response = await Axios.get(URL_API_GET_BANNER);

    let {
      data: {
        data: {banner},
      },
    } = response;

    // sync with local storage
    return banner.map(item => new Banner(item));
  };
}
