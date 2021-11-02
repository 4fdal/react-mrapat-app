import {FlatList, Input, Text, Toast, View} from 'native-base';
import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import Image from 'react-native-scalable-image';
import {
  colorDanger,
  colorDark,
  colorLight,
  colorPrimary,
  colorSuccess,
} from '../../components/styles/color-keys';
import {Banner} from '../../requests/banner';
import {Event} from '../../storage/event';
import ImgDataNotFound from '../../assets/images/data-not-found.png';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Authenticate} from '../../storage/authenticate';
import {Login} from '../../requests/login';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class HomeListEvent extends React.Component {
  state = {
    events: [],
    banners: [],
    search: '',
    showImageSource: null,
    visibleShowImage: false,
    indexCarouselActive: 0,
    isDataLoaded: false,
    refreshing: false,
  };

  refCarousel = null;
  refShowImage = null;

  navigationOption = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View mr={3}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('HistoryEventScreen')}
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon color={colorPrimary} name="time" size={24} />
            <Text ml={1}>History</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: props => (
        <Input
          w={Dimensions.get('screen').width - 110}
          ml={2}
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
  getListEvent = async () => {
    try {
      let {events} = await Event.getEventNow();
      this.setState({events});
    } catch (error) {
      Toast.show({
        title: 'Invalidate',
        status: 'error',
        description: error.getMessage(),
      });
    }
  };
  getListBanner = async () => {
    try {
      let banners = await Banner.make();
      this.setState({banners});
    } catch (error) {
      Toast.show({
        title: 'Invalidate',
        status: 'error',
        description: error.getMessage(),
      });
    }
  };
  componentDidMount = () => {
    if (!this.state.isDataLoaded) {
      this.navigationOption();
      this.getListEvent();
      this.getListBanner();
      this.setState({isDataLoaded: true});
    }
    this.props.navigation.addListener('focus', () => {
      this.navigationOption();
      this.getListEvent();
      this.getListBanner();
    });
  };
  _renderItemCarousel = ({item: {gambar: uri, nama, informasi_gambar}}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({visibleShowImage: true, showImageSource: uri});
        }}>
        <Image
          style={{borderRadius: 10}}
          width={Dimensions.get('screen').width - 20} // height will be calculated automatically
          source={{uri}}
        />
      </TouchableOpacity>
    );
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
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={async () => {
                try {
                  let {nip, password} = await Authenticate.get();
                  await Login.make({nip, password});
                  this.getListEvent();
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
            />
          }>
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                margin: 10,
                shadowColor: colorDark,
                elevation: 10,
                shadowRadius: 10,
              }}>
              <Modal visible={this.state.visibleShowImage} transparent={true}>
                <ImageViewer
                  enableSwipeDown={true}
                  onSwipeDown={() => this.setState({visibleShowImage: false})}
                  backgroundColor="rgba(255,255,255,0.7)"
                  imageUrls={[{url: this.state.showImageSource}]}
                />
              </Modal>
              <Carousel
                ref={refCarousel => {
                  this.refCarousel = refCarousel;
                }}
                data={this.state.banners}
                renderItem={this._renderItemCarousel}
                sliderWidth={Dimensions.get('screen').width}
                itemWidth={Dimensions.get('screen').width}
                onSnapToItem={indexCarouselActive =>
                  this.setState({indexCarouselActive})
                }
              />
              <Pagination
                containerStyle={{
                  ...StyleSheet.absoluteFill,
                  alignItems: 'flex-end',
                }}
                dotsLength={this.state.banners.length}
                activeDotIndex={this.state.indexCarouselActive}
                dotColor={'rgba(255, 255, 255, 0.92)'}
                inactiveDotColor={colorDark}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text mx={3} fontSize={16} fontWeight="bold">
                Jadwal Rapat
              </Text>
            </View>
            {events.length == 0 && (
              <View
                mt={10}
                style={{flexDirection: 'column', alignItems: 'center'}}>
                <Image source={ImgDataNotFound} width={250} />
                <Text fontWeight="light">Tidak ada jadwal rapat</Text>
              </View>
            )}
            {events.map((item, index) => {
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
                  key={`item-rapat-` + index}
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
                        backgroundColor: 'white',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderTopStartRadius: 10,
                        borderTopEndRadius: 10,
                      }}>
                      <Text
                        color={colorPrimary}
                        fontSize={16}
                        fontWeight="bold">
                        {nama_raker}
                      </Text>
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
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});
