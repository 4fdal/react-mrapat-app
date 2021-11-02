import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_PROFILE} from './keys';

export class Profile {
  constructor({
    id,
    nip_pegawai,
    nama_pegawai,
    bidang_pegawai,
    unit_pegawai,
    email_pegawai,
    no_telpon,
  }) {
    this.id = id;
    this.nip_pegawai = nip_pegawai;
    this.nama_pegawai = nama_pegawai;
    this.unit_pegawai = unit_pegawai;
    this.bidang_pegawai = bidang_pegawai;
    this.email_pegawai = email_pegawai;
    this.no_telpon = no_telpon;
  }

  store = async () => {
    await AsyncStorage.setItem(STORAGE_PROFILE, JSON.stringify(this));
    return this;
  };

  static get = async () => {
    let profile = JSON.parse(await AsyncStorage.getItem(STORAGE_PROFILE));
    return new Profile(profile);
  };
}
