import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Text, Toast, View} from 'native-base';
import React from 'react';
import {Dimensions} from 'react-native';
import {Login} from '../../requests/login';
import {Authenticate} from '../../storage/authenticate';
import {STORAGE_HOST} from '../../storage/keys';

export default class SplashScreen extends React.Component {
  state = {};

  componentDidMount = async () => {
    // validate use demo
    let finishDemo = new Date('2021/11/5 01:00').getTime();
    let now = new Date().getTime();

    if (now > finishDemo) {
      return Toast.show({
        title: 'Warning',
        status: 'warning',
        description:
          'Demo aplikasi telah berakhir silahkan hubungi developer untuk tahap pemulihan aplikasi, terimakasih...',
      });
    }
    // end validate use demo

    let host = await AsyncStorage.getItem(STORAGE_HOST);

    if (!host) {
      return this.props.navigation.replace('HostScreen');
    }

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
        this.props.navigation.replace('LoginScreen');
      }
    } catch (error) {
      this.props.navigation.replace('LoginScreen');
    }
  };
  render = () => {
    return (
      <View
        style={{
          height: Dimensions.get('screen').height,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <Text fontSize="xl">Management Ruang Rapat</Text>
          <Text style={{textAlign: 'center'}}>Please Wait...</Text>
        </View>
      </View>
    );
  };
}
