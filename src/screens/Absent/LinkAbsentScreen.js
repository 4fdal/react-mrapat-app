import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Divider, Spinner, Text, Toast, View, VStack} from 'native-base';
import React from 'react';
import {colorLight} from '../../components/styles/color-keys';
import {Login} from '../../requests/login';
import Meting from '../../requests/meting';
import {Authenticate} from '../../storage/authenticate';
import {KEY_PROFILE_PARTICIPANT} from '../../storage/keys';
import TakeAbsent from '../../requests/absent';
import {Linking, TouchableOpacity} from 'react-native';

export const STORE_PARAMS_METING_ID = 'store_params_meting_id';

export default class LinkAbsentScreen extends React.Component {
  state = {
    hasLoaded: true,
    isMetingNotFound: false,
    hasStoredMetingId: false,
    rapat: {},
  };

  componentDidMount = () => {
    this.handleRouteParamsGet().then(this.handleRequestGetRapat);
  };

  getIdRapat = () => this.props?.route?.params?.id_rapat;

  handleRouteParamsGet = () => {
    this.setState({hasStoredMetingId: false});
    const idRapat = this.getIdRapat();
    return AsyncStorage.setItem(STORE_PARAMS_METING_ID, idRapat)
      .catch(() => this.props.navigation.navigate('SplashScreen'))
      .finally(() => this.setState({hasStoredMetingId: true}));
  };

  handleRequestGetRapat = () => {
    const idRapat = this.getIdRapat();
    this.setState({hasLoaded: false});
    return Meting.get(idRapat)
      .then(
        ({
          data: {
            data: {raker},
          },
        }) => {
          this.setState({rapat: raker});
        },
      )
      .finally(() => this.setState({hasLoaded: true}));
  };

  handleAbsentInternal = () => {
    Authenticate.get()
      .then(async authenticate => {
        if (
          authenticate?.nip &&
          authenticate?.password &&
          authenticate?.phoneKey &&
          authenticate?.data
        ) {
          try {
            let {nip, password} = authenticate;
            let login = await Login.make({nip, password});
            if (login?.data?.raker) {
              const idRapat = this.getIdRapat();
              const {peserta} = await TakeAbsent.take(nip, idRapat, idRapat);

              if (peserta.status_absensi != 1) {
                Toast.show({
                  title: `Berhasil mengambil absensi pada rapat '${peserta.raker.nama_raker}' dengan keterangan '${peserta.keterangan_absensi}' pada waktu '${peserta.tanggal_jam_absensi}'`,
                });
              } else {
                Toast.show({
                  title: `Telah melakukan pengambilan absensi sebelumnya pada rapat '${peserta.raker.nama_raker}' dengan keterangan '${peserta.keterangan_absensi}' pada waktu '${peserta.tanggal_jam_absensi}'`,
                });
              }

              await Login.make({nip, password});
              this.props.navigation.navigate('SplashScreen', {
                id_rapat: idRapat,
              });
            } else {
              this.props.navigation.replace('LoginScreen');
            }
          } catch (error) {
            let message = error?.response?.data?.msg;
            if (message) {
              if (message.length > 0) {
                Toast.show({
                  title: 'Invalidate',
                  status: 'error',
                  description: message.join('\n'),
                });
              }
            }
            this.props.navigation.replace('LoginScreen');
          }
        } else {
          Toast.show({
            title:
              'Data login tidak ditemukan, login akun anda terlebih dahulu',
            background: 'red.400',
          });
          this.props.navigation.replace('LoginScreen');
        }
      })
      .catch(() => {
        Toast.show({
          title: 'Data login tidak ditemukan, login akun anda terlebih dahulu',
          background: 'red.400',
        });
        this.props.navigation.replace('LoginScreen');
      });

    // this.checkAuthentication().then(async () => {
    //   try {
    //   } catch (error) {
    //     Toast.show({
    //       title:
    //         'Maaf, terjadi kesalahan dalam pengambilan absent, mohon lakukan pengambilan absent pada tempat anda melaksanakan rapat',
    //       background: 'red.400',
    //     });
    //     this.props.navigation.replace('HomeBottomNavigationRoute');
    //   }
    // });
  };

  handleAbsentExternal = () => {
    const redirectToAbsensiExternalParticipantScreen = (message = null) => {
      if (message)
        Toast.show({
          title: message,
          background: 'red.400',
        });
      this.props.navigation.navigate('AbsensiExternalParticipantScreen', {
        id_rapat: this.getIdRapat(),
      });
    };

    AsyncStorage.getItem(KEY_PROFILE_PARTICIPANT)
      .then(profileParticipant => {
        if (profileParticipant) {
          profileParticipant = JSON.parse(profileParticipant);
          if (profileParticipant) {
            const profile = {
              id_rapat: this.getIdRapat(),
              nama_perusahaan: profileParticipant.nama_perusahaan,
              nama: profileParticipant.nama,
              jabatan: profileParticipant.jabatan,
              email: profileParticipant.email,
              no_telpon: profileParticipant.no_telpon,
            };

            return TakeAbsent.takeExternal(this, profile).then(() => {
              Toast.show({
                title: 'Berhasil mengambil absent',
              });
            });
          }
        } else {
          redirectToAbsensiExternalParticipantScreen(
            'Data absensi untuk peserta rapat external belum lengkap, segera lengkapi terlebih dahulu',
          );
        }
      })
      .catch(err => {
        redirectToAbsensiExternalParticipantScreen(err.message);
      })
      .finally(() => this.setState({hasLoadedAsyncStorage: true}));
  };

  render = () => {
    return (
      <VStack flex={1} alignItems={'center'} justifyContent={'center'}>
        {this.state.hasLoaded ? (
          <VStack space={2}>
            <VStack
              style={{
                flexDirection: 'column',
                backgroundColor: colorLight,
                padding: 10,
                borderRadius: 10,
                width: 350,
              }}>
              <View>
                <Text fontSize={16} fontWeight="bold">
                  {this.state.rapat?.nama_raker}
                </Text>
                <Divider my={1} />
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Tipe Rapat</Text>
                      <Text fontWeight="light">
                        {this.state.rapat?.tipe_rapat}
                      </Text>
                    </View>
                    {this.state.rapat?.tipe_rapat != 'offline' ? (
                      <View style={{flexDirection: 'column'}}>
                        <Text fontWeight="bold">Link Rapat</Text>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(this.state.rapat?.link_rapat);
                          }}>
                          <Text color={'blue.400'} fontWeight="light">
                            {this.state.rapat?.link_rapat}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Mulai Rapat</Text>
                      <Text fontWeight="light">
                        {this.state.rapat?.tanggal_jam_masuk_raker}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Selesai Rapat</Text>
                      <Text fontWeight="light">
                        {this.state.rapat?.tanggal_jam_keluar_raker}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Jumlah Peserta</Text>
                      <Text fontWeight="light">
                        {this.state.rapat?.jumlah_peserta_raker} Orang
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Deskripsi</Text>
                      <Text fontWeight="light">
                        {this.state.rapat?.deskripsi_raker}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </VStack>
            <VStack space={1}>
              <Button onPress={this.handleAbsentInternal}>
                Absensi Peserta Internal
              </Button>
              <Button onPress={this.handleAbsentExternal}>
                Absensi Peserta Ekternal
              </Button>
            </VStack>
          </VStack>
        ) : (
          <VStack m={'10'} space={1}>
            <Text textAlign={'center'} fontSize={'lg'}>
              Memeriksa Data Rapat
            </Text>
            <Text textAlign={'center'} fontSize={'sm'}>
              Mohon tunggu beberapa saat untuk proses pengambilan data rapat
            </Text>
            <Spinner mt={5} />
          </VStack>
        )}
      </VStack>
    );
  };
}
