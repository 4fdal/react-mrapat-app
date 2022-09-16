import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AddIcon,
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Text,
  Toast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import TakeAbsent from '../../requests/absent';
import {KEY_PROFILE_PARTICIPANT} from '../../storage/keys';

export default class AbsensiExternalParticipantScreen extends React.Component {
  partialScreen = {
    title: 'Peserta Rapat Ekternal',
  };

  state = {
    hasLoadedAsyncStorage: false,
    hasEdit: true,
    formDefault: {
      id_rapat: null,
      nama_perusahaan: null,
      nama: null,
      jabatan: null,
      email: null,
      no_telpon: null,
    },
    form: {
      id_rapat: null,
      nama_perusahaan: null,
      nama: null,
      jabatan: null,
      email: null,
      no_telpon: null,
    },
    formValidate: {
      id_rapat: null,
      nama_perusahaan: null,
      nama: null,
      jabatan: null,
      email: null,
      no_telpon: null,
    },
  };

  setForm = (dataForm, hasSetDefault = false) => {
    this.setState(state => {
      state.form = {
        ...state.form,
        ...dataForm,
      };

      if (hasSetDefault) {
        state.formDefault = {
          ...state.form,
          ...dataForm,
        };
      }

      return state;
    });
  };

  componentDidMount = () => {
    this.handleGetIdRapatWithParams();

    this.props.navigation.setOptions(this.partialScreen);
    this.loadProfileParticipant();
  };

  handleGetIdRapatWithParams = () => {
    const id_rapat = this.props?.route?.params?.id_rapat ?? null;
    if (id_rapat) {
      let stateScreen = this.state;
      stateScreen.formDefault.id_rapat = id_rapat;
      stateScreen.form.id_rapat = id_rapat;
      this.setState(stateScreen);
    }
  };

  loadProfileParticipant = () => {
    AsyncStorage.getItem(KEY_PROFILE_PARTICIPANT)
      .then(profileParticipant => {
        if (profileParticipant) {
          profileParticipant = JSON.parse(profileParticipant);
          if (profileParticipant) {
            this.setForm(
              {
                nama_perusahaan: profileParticipant.nama_perusahaan,
                nama: profileParticipant.nama,
                jabatan: profileParticipant.jabatan,
                email: profileParticipant.email,
                no_telpon: profileParticipant.no_telpon,
              },
              true,
            );
          }
        }
      })
      .finally(() => this.setState({hasLoadedAsyncStorage: true}));
  };

  onPressSaveDataParticipant = () => {
    AsyncStorage.setItem(
      KEY_PROFILE_PARTICIPANT,
      JSON.stringify(this.state.form),
    ).then(() => {
      Toast.show({
        title: 'Berhasil menyimpan profile peserta rapat',
      });
    });
  };

  onPressAmbilAbsensi = () => {
    TakeAbsent.takeExternal(this, this.state.form).then(() => {
      Toast.show({
        title: 'Berhasil mengambil absent',
      });
    });
  };

  render = () => {
    return (
      <ScrollView>
        <VStack m={3}>
          {this.state.hasLoadedAsyncStorage && (
            <VStack>
              <VStack shadow={1}>
                <VStack
                  shadow={1}
                  rounded={'lg'}
                  px={3}
                  pt={3}
                  pb={10}
                  bgColor="white">
                  <HStack>
                    <Text fontSize={'lg'} bold>
                      Profile Peserta Rapat
                    </Text>
                  </HStack>

                  {this.state.hasEdit && (
                    <VStack space={2}>
                      <FormControl
                        isInvalid={
                          this.state.formValidate.nama_perusahaan != null
                        }>
                        <FormControl.Label>Nama Perusahaan</FormControl.Label>
                        <Input
                          onChangeText={nama_perusahaan =>
                            this.setForm({nama_perusahaan})
                          }
                          defaultValue={this.state.formDefault.nama_perusahaan}
                          placeholder="Nama Perusahaan"
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}>
                          {this.state.formValidate.nama_perusahaan}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={this.state.formValidate.nama != null}>
                        <FormControl.Label>Nama</FormControl.Label>
                        <Input
                          defaultValue={this.state.formDefault.nama}
                          onChangeText={nama => this.setForm({nama})}
                          placeholder="Nama"
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}>
                          {this.state.formValidate.nama}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={this.state.formValidate.jabatan != null}>
                        <FormControl.Label>Jabatan</FormControl.Label>
                        <Input
                          defaultValue={this.state.formDefault.jabatan}
                          onChangeText={jabatan => this.setForm({jabatan})}
                          placeholder="Jabatan"
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}>
                          {this.state.formValidate.jabatan}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={this.state.formValidate.email != null}>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input
                          defaultValue={this.state.formDefault.email}
                          onChangeText={email => this.setForm({email})}
                          placeholder="Email"
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}>
                          {this.state.formValidate.email}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={this.state.formValidate.no_telpon != null}>
                        <FormControl.Label>Nomor Telpon</FormControl.Label>
                        <Input
                          defaultValue={this.state.formDefault.no_telpon}
                          onChangeText={no_telpon => this.setForm({no_telpon})}
                          placeholder="Nomor Telpon"
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}>
                          {this.state.formValidate.no_telpon}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <HStack direction={'row-reverse'} mt={2}>
                        <Button
                          onPress={this.onPressSaveDataParticipant}
                          leftIcon={<AddIcon size={'xs'} />}>
                          <Text color={'white'} fontWeight={'bold'}>
                            Simpan Data
                          </Text>
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              </VStack>

              <Divider my={5} />
            </VStack>
          )}

          <VStack
            shadow={1}
            rounded={'lg'}
            px={3}
            pt={3}
            pb={10}
            bgColor="white">
            <Text fontSize={'2xl'} bold>
              Absensi Rapat
            </Text>

            <FormControl isInvalid={this.state.formValidate.id_rapat != null}>
              <FormControl.Label>Id Rapat</FormControl.Label>
              <Input
                defaultValue={this.state.formDefault.id_rapat}
                onChangeText={id_rapat => this.setForm({id_rapat})}
                placeholder="Id Rapat"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {this.state.formValidate.id_rapat}
              </FormControl.ErrorMessage>
            </FormControl>

            <HStack direction={'row-reverse'} mt={2}>
              <Button onPress={this.onPressAmbilAbsensi}>
                <Text color={'white'} fontWeight={'bold'}>
                  Ambil Absensi
                </Text>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    );
  };
}
