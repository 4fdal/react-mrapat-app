import React, {Component} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {Text, Toast, View} from 'native-base';
import Absent from '../../requests/absent';
import {Authenticate} from '../../storage/authenticate';
import {Login} from '../../requests/login';

export default class AbsentScreen extends Component {
  state = {
    event: this.props.route.params.event,
  };

  handleNavigationOptions = () => {
    this.props.navigation.setOptions({
      title: 'Pengambilan Absensi',
    });
  };

  componentDidMount = () => {
    this.handleNavigationOptions();
  };

  onSuccess = async ({data: appUrl}) => {
    // appUrl output_ex. mrapatapp://absent/181336
    const subUrl = 'absent/';
    const rakerQrcode = appUrl.substring(
      appUrl.indexOf(subUrl) + subUrl.length,
    );
    let {id: raker} = this.state.event;

    try {
      let {nip, password} = await Authenticate.get();
      await Absent.take(nip, raker, rakerQrcode);
      await Login.make({nip, password});

      this.props.navigation.replace('HomeBottomNavigationRoute');
    } catch (error) {
      let message = error?.response?.data?.err;
      if (message) {
        if (message.length > 0) {
          Toast.show({
            title: 'Invalidate',
            status: 'error',
            description: message.join('\n'),
          });
        }
      }
      this.props.navigation.goBack();
    }
  };

  render() {
    let {nama_raker} = this.state.event;

    return (
      <QRCodeScanner
        showMarker={true}
        onRead={this.onSuccess}
        topContent={
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              marginTop: -70,
              flexDirection: 'column',
            }}>
            <Text textAlign="center" fontWeight="bold" fontSize={16}>
              Silahkan lakukan scann QRCode untuk pengambilan absensi pada rapat
            </Text>
            <Text textAlign="center" fontWeight="light" fontSize={14}>
              {nama_raker}
            </Text>
          </View>
        }
      />
    );
  }
}
