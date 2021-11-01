import {View} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class HomeProfileEvent extends React.Component {
  componentDidMount = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View mr={3}>
          <TouchableOpacity>
            <Icon name="log-out" size={24} />
          </TouchableOpacity>
        </View>
      ),
    });
  };
  render = () => {
    return <></>;
  };
}
