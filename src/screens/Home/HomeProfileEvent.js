import {
  Button,
  Divider,
  FormControl,
  Input,
  ScrollView,
  Text,
  Toast,
  View,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {colorLight, colorPrimary} from '../../components/styles/color-keys';
import {Authenticate} from '../../storage/authenticate';
import {Profile} from '../../storage/profile';
import {User} from '../../requests/user';

export default class HomeProfileEvent extends React.Component {
  state = {
    profile: {},
    isActiveEdit: false,
    isActiveEditPassword: false,
    password: {
      oldPassword: null,
      newPassword: null,
      newPasswordConfirm: null,
      invalidate: {
        oldPassword: null,
        newPassword: null,
        newPasswordConfirm: null,
      },
    },
  };

  _onPressLogout = () => {
    Alert.alert('Logout Account', 'Kamu akan keluar dari akun ini?', [
      {
        text: 'Ya',
        style: 'default',
        onPress: async () => {
          try {
            await Authenticate.logout();
            this.props.navigation.replace('LoginScreen');
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
          }
        },
      },
      {text: 'Tidak', style: 'cancel'},
    ]);
  };

  handleNavigationOptions = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View mr={3}>
          <TouchableOpacity onPress={this._onPressLogout}>
            <Icon name="log-out" color={colorPrimary} size={24} />
          </TouchableOpacity>
        </View>
      ),
    });
  };

  handleGetProfile = async () => {
    try {
      let profile = await Profile.get();
      this.setState({profile});
    } catch (error) {
      Toast.show({
        title: 'Invalidate',
        status: 'error',
        description: error,
      });
    }
  };

  componentDidMount = () => {
    this.handleNavigationOptions();
    this.handleGetProfile();
  };

  render = () => {
    let {
      nip_pegawai,
      nama_pegawai,
      bidang_pegawai,
      unit_pegawai,
      email_pegawai,
      no_telpon,
    } = this.state.profile;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              margin: 10,
              padding: 10,
              flexDirection: 'column',
              backgroundColor: colorLight,
              borderRadius: 10,
            }}>
            <FormControl>
              <FormControl.Label>NIP Pegawai</FormControl.Label>
              <Input isDisabled={true} value={nip_pegawai} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Nama Pegawai</FormControl.Label>
              <Input isDisabled={true} value={nama_pegawai} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Bidang Pegawai</FormControl.Label>
              <Input isDisabled={true} value={bidang_pegawai} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Unit Pegawai</FormControl.Label>
              <Input isDisabled={true} value={unit_pegawai} />
            </FormControl>
          </View>
          <View
            style={{
              margin: 10,
              padding: 10,
              flexDirection: 'column',
              backgroundColor: colorLight,
              borderRadius: 10,
            }}>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({isActiveEdit: !this.state.isActiveEdit})
                }>
                <Icon name="edit" color={colorPrimary} size={24} />
              </TouchableOpacity>
            </View>
            <FormControl isInvalid={false}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                isDisabled={!this.state.isActiveEdit}
                placeholder="Email"
                value={email_pegawai}
                onChangeText={email_pegawai => {
                  this.setState({
                    profile: {
                      ...this.state.profile,
                      email_pegawai,
                    },
                  });
                }}
              />
              {false && (
                <FormControl.ErrorMessage
                  leftIcon={
                    <WarningOutlineIcon size="xs" />
                  }></FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={false}>
              <FormControl.Label>Phone</FormControl.Label>
              <Input
                isDisabled={!this.state.isActiveEdit}
                placeholder="Phone"
                value={no_telpon}
                onChangeText={no_telpon => {
                  this.setState({
                    profile: {
                      ...this.state.profile,
                      no_telpon,
                    },
                  });
                }}
              />
              {false && (
                <FormControl.ErrorMessage
                  leftIcon={
                    <WarningOutlineIcon size="xs" />
                  }></FormControl.ErrorMessage>
              )}
            </FormControl>
            {this.state.isActiveEdit && (
              <Button
                onPress={async () => {
                  try {
                    let {profile} = this.state;
                    await User.change({
                      email_pegawai: profile.email_pegawai,
                      no_telpon: profile.no_telpon,
                    });
                    await profile.store();

                    Toast.show({
                      title: 'Success',
                      status: 'success',
                      description: 'Berhasil mengubah profile',
                    });
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
                  }
                }}
                mt={2}>
                <Text color={colorLight}>Simpan</Text>
              </Button>
            )}
          </View>
          <View
            style={{
              margin: 10,
              padding: 10,
              flexDirection: 'column',
              backgroundColor: colorLight,
              borderRadius: 10,
            }}>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isActiveEditPassword: !this.state.isActiveEditPassword,
                  })
                }>
                <Icon name="edit" color={colorPrimary} size={24} />
              </TouchableOpacity>
            </View>
            <FormControl isInvalid={this.state.password.invalidate.oldPassword}>
              <FormControl.Label>Password Lama</FormControl.Label>
              <Input
                isDisabled={!this.state.isActiveEditPassword}
                placeholder="Password Lama"
                secureTextEntry
                onChangeText={oldPassword =>
                  this.setState({
                    password: {
                      ...this.state.password,
                      oldPassword,
                    },
                  })
                }
              />
              {this.state.password.invalidate.oldPassword && (
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {this.state.password.invalidate.oldPassword}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={this.state.password.invalidate.newPassword}>
              <FormControl.Label>Password Baru</FormControl.Label>
              <Input
                isDisabled={!this.state.isActiveEditPassword}
                placeholder="Password Baru"
                onChangeText={newPassword =>
                  this.setState({
                    password: {
                      ...this.state.password,
                      newPassword,
                    },
                  })
                }
                secureTextEntry
              />
              {this.state.password.invalidate.newPassword && (
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {this.state.password.invalidate.newPassword}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={false}>
              <FormControl.Label>Password Baru Confirmasi</FormControl.Label>
              <Input
                isDisabled={!this.state.isActiveEditPassword}
                placeholder="Password Baru Confirmasi"
                secureTextEntry
                onChangeText={newPasswordConfirm =>
                  this.setState({
                    password: {
                      ...this.state.password,
                      newPasswordConfirm,
                    },
                  })
                }
              />
              {false && (
                <FormControl.ErrorMessage
                  leftIcon={
                    <WarningOutlineIcon size="xs" />
                  }></FormControl.ErrorMessage>
              )}
            </FormControl>
            {this.state.isActiveEditPassword && (
              <Button
                onPress={async () => {
                  let {newPassword, newPasswordConfirm, oldPassword} =
                    this.state.password;

                  let invalidate = [];
                  if (oldPassword == null || oldPassword == '') {
                    invalidate.push('Password lama harus berisi');
                  }
                  if (newPassword == null || newPassword == '') {
                    invalidate.push('Password baru harus berisi');
                  }
                  if (newPassword != newPasswordConfirm) {
                    invalidate.push(
                      'Password konfirmasi harus sama dengan password',
                    );
                  }

                  if (invalidate.length > 0) {
                    return Toast.show({
                      title: 'Invalidate',
                      status: 'error',
                      description: invalidate.join('\n'),
                    });
                  }

                  try {
                    let {data} = await User.changePassword({
                      password_baru: newPassword,
                      password_lama: oldPassword,
                    });

                    Toast.show({
                      title: 'Success',
                      status: 'success',
                      description: 'Berhasil mengubah password',
                    });
                  } catch (error) {
                    let message = error?.response?.data?.err;
                    if (message) {
                      if (message.length > 0) {
                        Toast.show({
                          title: 'Invalidate',
                          status: 'error',
                          description: Array.isArray(message)
                            ? message.join('\n')
                            : message,
                        });
                      }
                    }
                  }
                }}
                mt={2}>
                <Text color={colorLight}>Simpan</Text>
              </Button>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
}
