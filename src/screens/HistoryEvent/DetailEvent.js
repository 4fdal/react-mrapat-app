import {Divider, HStack, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  colorDanger,
  colorLight,
  colorPrimary,
  colorSuccess,
} from '../../components/styles/color-keys';

export default class DetailEvent extends React.Component {
  state = {
    event: this.props.route.params.event,
  };
  handleNavigationOptions = () => {
    this.props.navigation.setOptions({
      title: 'Detail Absent',
      headerRight:
        this.state.event.status_absensi == 0
          ? props => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AbsentScreen', {
                    event: this.state.event,
                  })
                }
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="checkmark" color={colorPrimary} size={24} />
                <Text fontSize={16} fontWeight="bold" color={colorPrimary}>
                  Absent Rapat
                </Text>
              </TouchableOpacity>
            )
          : null,
    });
  };
  componentDidMount = () => {
    this.handleNavigationOptions();
  };
  render = () => {
    let {event} = this.state;
    let {
      nama_raker,
      deskripsi_raker,
      jumlah_peserta_raker,
      keterangan_absensi,
      status_absensi,
      tanggal_jam_absensi,
      tanggal_jam_keluar_raker,
      tanggal_jam_masuk_raker,
      tipe_rapat,
      link_rapat,
      notulen_raker: {
        bidang_pegawai,
        email_pegawai,
        nama_pegawai,
        nip_pegawai,
        no_telpon,
        unit_pegawai,
      },
      ruangan: {kapasitas_ruangan, nama_ruangan},
      peserta_raker,
    } = event;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              alignItems: 'stretch',
              flexDirection: 'column',
              margin: 10,
            }}>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: colorLight,
                padding: 10,
                borderRadius: 10,
              }}>
              <View>
                <Text fontSize={16} fontWeight="bold">
                  {nama_raker}
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
                      <Text fontWeight="light">{tanggal_jam_masuk_raker}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Selesai Rapat</Text>
                      <Text fontWeight="light">{tanggal_jam_keluar_raker}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Jumlah Peserta</Text>
                      <Text fontWeight="light">
                        {jumlah_peserta_raker} Orang
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Deskripsi</Text>
                      <Text fontWeight="light">{deskripsi_raker}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginRight: 5,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="time-outline"
                        color={status_absensi ? colorSuccess : colorDanger}
                        size={24}
                      />
                      <Text ml={2} fontWeight="bold">
                        {keterangan_absensi || 'BELUM ABSEN'}
                      </Text>
                    </View>
                    {status_absensi ? (
                      <Text fontWeight="light">{tanggal_jam_absensi}</Text>
                    ) : null}
                  </View>
                </View>

                <VStack>
                  <View style={{flexDirection: 'column'}}>
                    <Text fontWeight="bold">Tipe Rapat</Text>
                    <Text fontWeight="light">{tipe_rapat}</Text>
                  </View>
                  {link_rapat ? (
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Link Rapat</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(link_rapat);
                        }}>
                        <Text color={'blue.400'} fontWeight="light">
                          {link_rapat}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <></>
                  )}
                </VStack>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: colorLight,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View>
                <Text fontSize={16} fontWeight="bold">
                  Notulen Rapat
                </Text>
                <Divider my={1} />
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Nip</Text>
                      <Text fontWeight="light">{nip_pegawai}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Nama</Text>
                      <Text fontWeight="light">{nama_pegawai}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Email</Text>
                      <Text fontWeight="light">{email_pegawai}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Phone</Text>
                      <Text fontWeight="light">{no_telpon}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginRight: 5,
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Unit</Text>
                      <Text fontWeight="light">{unit_pegawai}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text fontWeight="bold">Bidang</Text>
                      <Text fontWeight="light">{bidang_pegawai}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Text my={2} fontWeight="bold" fontSize={16}>
              Pegawai Peserta Rapat
            </Text>

            {peserta_raker.map(
              (
                {
                  bidang_pegawai,
                  email_pegawai,
                  nama_pegawai,
                  nip_pegawai,
                  no_telpon,
                  unit_pegawai,
                },
                index,
              ) => {
                return (
                  <View
                    key={`peserta-rapat-${index}`}
                    style={{
                      flexDirection: 'column',
                      backgroundColor: colorLight,
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 10,
                    }}>
                    <View>
                      <Text fontSize={16} fontWeight="bold">
                        {nama_pegawai} | {nip_pegawai}
                      </Text>
                      <Divider my={1} />
                      <View
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <View>
                          <View style={{flexDirection: 'column'}}>
                            <Text fontWeight="bold">Email</Text>
                            <Text fontWeight="light">{email_pegawai}</Text>
                          </View>
                          <View style={{flexDirection: 'column'}}>
                            <Text fontWeight="bold">Phone</Text>
                            <Text fontWeight="light">{no_telpon}</Text>
                          </View>
                        </View>
                        <View
                          style={{
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginRight: 5,
                          }}>
                          <View style={{flexDirection: 'column'}}>
                            <Text fontWeight="bold">Unit</Text>
                            <Text fontWeight="light">{unit_pegawai}</Text>
                          </View>
                          <View style={{flexDirection: 'column'}}>
                            <Text fontWeight="bold">Bidang</Text>
                            <Text fontWeight="light">{bidang_pegawai}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              },
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
}
