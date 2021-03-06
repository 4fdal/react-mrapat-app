import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Text, Toast, View} from 'native-base';
import React from 'react';
import {Dimensions} from 'react-native';
import {Login} from '../../requests/login';
import {Authenticate} from '../../storage/authenticate';

export default class SplashScreen extends React.Component {
  componentDidMount = async () => {
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
