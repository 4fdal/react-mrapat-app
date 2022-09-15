import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Center,
  Container,
  Divider,
  HStack,
  ScrollView,
  Spinner,
  Text,
  Toast,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  colorDanger,
  colorLight,
  colorSuccess,
} from '../../components/styles/color-keys';
import {Login} from '../../requests/login';
import Meting from '../../requests/meting';
import {Authenticate} from '../../storage/authenticate';

export const STORE_PARAMS_METING_ID = 'store_params_meting_id';

export default class LinkAbsentScreen extends React.Component {
  state = {
    hasLoaded: false,
    hasStoredMetingId: false,
    rapat: {},
  };

  componentDidMount = () => {
    this.handleRouteParamsGet().then(() => {
      // this.handleRequestGetRapat();
    });
  };

  handleRouteParamsGet = () => {
    this.setState({hasStoredMetingId: false});
    const idRapat = this.props?.route?.params?.id_rapat ?? null;
    return AsyncStorage.setItem(STORE_PARAMS_METING_ID, idRapat).finally(() =>
      this.setState({hasStoredMetingId: true}),
    );
  };

  handleRequestGetRapat = () => {
    const idRapat = this.props?.route?.params?.id_rapat;
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

  checkAuthentication = async () => {
    try {
      let authenticate = await Authenticate.get();

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
            this.props.navigation.replace('HomeBottomNavigationRoute');
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
          title: 'Data login tidak ditemukan, login akun anda terlebih dahulu',
          background: 'red.400',
        });
        this.props.navigation.replace('LoginScreen');
      }
    } catch (error) {
      Toast.show({
        title: 'Data login tidak ditemukan, login akun anda terlebih dahulu',
        background: 'red.400',
      });
      this.props.navigation.replace('LoginScreen');
    }
  };

  handleAbsentInternal = () => {
    this.checkAuthentication().then(async () => {
      try {
      } catch (error) {
        Toast.show({
          title:
            'Maaf, terjadi kesalahan dalam pengambilan absent, mohon lakukan pengambilan absent pada tempat anda melaksanakan rapat',
          background: 'red.400',
        });
        this.props.navigation.replace('HomeBottomNavigationRoute');
      }
    });
  };

  handleAbsentExternal = () => {};

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
