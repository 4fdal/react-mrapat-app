import {
  Button,
  Center,
  FormControl,
  Toast,
  Input,
  View,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {Login} from '../../requests/login';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: null,
      password: null,
      validate: {
        nip: null,
        password: null,
      },
    };
  }
  onPressLoginButton = async () => {
    this.defaultValidate();
    let {nip, password} = this.state;

    let validate = {};
    if (nip == null || nip == undefined || nip == '')
      validate.nip = 'Data nip harus berisi';
    if (password == null || password == undefined || password == '')
      validate.password = 'Data password harus berisi';

    if (Object.values(validate).length > 0) {
      return this.setState({validate});
    }

    try {
      let login = await Login.make({nip, password});
      this.props.navigation.replace('HomeBottomNavigationRoute');
    } catch (error) {
      let message = error?.response?.data?.msg;
      if (message) {
        if (message.length > 0) {
          Toast.show({
            title: 'Invalidate',
            status: 'error',
            description: Array.isArray(message) ? message.join('\n') : message,
          });
        }
      }
    }
  };
  defaultValidate = () => {
    this.setState({validate: {nip: null, password: null}});
  };
  render = () => {
    return (
      <Center flex={1}>
        <View
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            padding: 40,
            borderRadius: 20,
          }}
          w={{
            base: '80%',
            md: '25%',
          }}>
          <FormControl isInvalid={this.state.validate.nip}>
            <FormControl.Label>Nip Pegawai</FormControl.Label>
            <Input
              onChangeText={nip => this.setState({nip})}
              placeholder="Masukan Nip Pegawai"
            />
            {this.state.validate.nip && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {this.state.validate.nip}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={this.state.validate.password} mt={5}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              secureTextEntry={true}
              onChangeText={password => this.setState({password})}
              placeholder="Masukan Password"
            />
            {this.state.validate.password && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {this.state.validate.password}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          <Button onPress={this.onPressLoginButton} mt={30}>
            Login
          </Button>
        </View>
      </Center>
    );
  };
}
