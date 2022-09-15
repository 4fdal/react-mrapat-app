import {HOST} from '../../app.config';

export const URL_API_LOGIN = HOST + '/api/absensi/login';
export const URL_API_GET_BANNER = HOST + '/api/data';
export const URL_API_TAKE_ABSENT = HOST + '/api/absensi';
export const URL_API_TAKE_ABSENT_EXTERNAL = HOST + '/api/absensi/external';
export const URL_API_CHANGE_PROFILE =
  HOST + '/api/absensi/change_profile/:phoneKey';
export const URL_API_CHANGE_PASSWORD =
  HOST + '/api/absensi/change_password/:phoneKey';

export const URL_API_GET_RAPAT = idRapat => HOST + '/api/rapat/' + idRapat;
