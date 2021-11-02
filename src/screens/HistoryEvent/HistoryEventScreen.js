import {FlatList, FormControl, Input, Text, Toast, View} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Image from 'react-native-scalable-image';
import ImgDataNotFound from '../../assets/images/data-not-found.png';
import {
  colorDanger,
  colorLight,
  colorPrimary,
  colorSuccess,
} from '../../components/styles/color-keys';
import {Event} from '../../storage/event';

export default class HistoryEventScreen extends React.Component {
  state = {
    events: [],
    search: '',
  };
  getListEvents = async () => {
    try {
      let {events} = await Event.getEventHistory();
      this.setState({events});
    } catch (error) {
      Toast.show({
        title: 'Invalidate',
        status: 'error',
        description: error.message,
      });
    }
  };
  handleNavigationOption = () => {
    this.props.navigation.setOptions({
      headerRight: props => (
        <Input
          w={80}
          variant="rounded"
          placeholder="Search"
          InputLeftElement={
            <Icon
              color={colorPrimary}
              size={24}
              style={{marginLeft: 10}}
              name="search"
            />
          }
          onChangeText={search => this.setState({search})}
        />
      ),
      title: null,
    });
  };
  componentDidMount = () => {
    this.getListEvents();
    this.handleNavigationOption();
  };
  render = () => {
    let {events, search} = this.state;

    if (search != '' && search != null) {
      events = events.filter(
        event =>
          event.nama_raker.toLowerCase().indexOf(search.toLowerCase()) != -1,
      );
    }

    return (
      <View style={{flexDirection: 'column'}}>
        <Text m={2} fontWeight="bold" fontSize={16}>
          History Rapat
        </Text>
        {events.length == 0 && (
          <View mt={10} style={{flexDirection: 'column', alignItems: 'center'}}>
            <Image source={ImgDataNotFound} width={250} />
            <Text fontWeight="light">Tidak ada jadwal rapat</Text>
          </View>
        )}
        <FlatList
          data={events}
          renderItem={({item}) => {
            let {
              nama_raker,
              tanggal_jam_masuk_raker,
              tanggal_jam_keluar_raker,
              jumlah_peserta_raker,
              status_absensi,
              tanggal_jam_absensi,
              keterangan_absensi,
              ruangan,
              notulen_raker,
            } = item;

            let {nama_ruangan} = ruangan;
            let {nama_pegawai} = notulen_raker;
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('DetailEvent', {
                    event: item,
                  })
                }
                style={{marginTop: 5, marginHorizontal: 10}}>
                <View style={{flexDirection: 'column'}}>
                  <View
                    style={{
                      padding: 10,
                      flex: 1,
                      backgroundColor: 'white',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}>
                    <Text style={{color: colorPrimary}}>{nama_raker}</Text>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Icon
                        name="time-outline"
                        color={status_absensi ? colorSuccess : colorDanger}
                        size={24}
                      />
                      <Text style={{fontWeight: 'bold'}}>
                        {keterangan_absensi || 'BELUM ABSEN'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      paddingTop: 10,
                      backgroundColor: colorLight,
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>TEMPAT</Text>
                      <Text>{nama_ruangan}</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>MULAI</Text>
                      <Text>{tanggal_jam_masuk_raker}</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>SELESAI</Text>
                      <Text>{tanggal_jam_keluar_raker}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      backgroundColor: colorLight,
                      justifyContent: status_absensi
                        ? 'space-between'
                        : 'space-around',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>NOTULEN</Text>
                      <Text>{nama_pegawai}</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontWeight: 'bold'}}>PESERTA</Text>
                      <Text>{jumlah_peserta_raker}</Text>
                    </View>
                    {status_absensi === 1 && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}>
                        <Text style={{fontWeight: 'bold'}}>WAKTU ABSEN</Text>
                        <Text>{tanggal_jam_absensi}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };
}
