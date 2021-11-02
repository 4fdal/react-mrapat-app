import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {Button, Input, Text, Toast, View} from 'native-base';
import React from 'react';
import {colorLight} from '../../components/styles/color-keys';
import {STORAGE_HOST} from '../../storage/keys';

export default class HostScreen extends React.Component {
  state = {
    host: '',
  };

  componentDidMount = async () => {
    try {
      let host = await AsyncStorage.getItem(STORAGE_HOST);
      this.setState({host});
    } catch (error) {
      Toast.show({
        title: 'Invalidate',
        status: 'error',
        description: 'Something Error ' + error.message,
      });
    }
  };

  render = () => {
    return (
      <View style={{margin: 10}}>
        <View
          style={{backgroundColor: colorLight, padding: 10, borderRadius: 10}}>
          <Text fontWeight="bold" style={{marginVertical: 10}}>
            Pastikan host yang kamu masukan di sini sesuai dengan alamat server,
            ex: http://192.168.203.77:8000
          </Text>
          <Input
            placeholder="http://host"
            onChangeText={host => this.setState({host})}
          />
          <Button
            onPress={async () => {
              try {
                await Axios.get(this.state.host);
                await AsyncStorage.setItem(STORAGE_HOST, this.state.host);
                this.props.navigation.navigate('SplashScreen');
              } catch (error) {
                if (error.response) {
                  Toast.show({
                    title: 'Invalidate',
                    status: 'error',
                    description: error.response.data.msg,
                  });
                } else {
                  Toast.show({
                    title: 'Invalidate',
                    status: 'error',
                    description: error.message,
                  });
                }
              }
            }}
            style={{marginVertical: 10}}>
            <Text color={colorLight}>Simpan Host</Text>
          </Button>
        </View>
      </View>
    );
  };
}
