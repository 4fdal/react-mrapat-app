import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeListEvent from '../screens/Home/HomeListEvent';
import HomeProfileEvent from '../screens/Home/HomeProfileEvent';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default class HomeBottomNavigationRoute extends React.Component {
  render = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          options={{
            tabBarLabel: 'List Rapat',
            title: 'Manajement Rapat',
            tabBarIcon: () => <Icon name="calendar" size={24} />,
          }}
          name="HomeListEvent"
          component={HomeListEvent}
        />
        <Tab.Screen
          options={{
            tabBarLabel: 'Profile',
            title: 'Profile',
            tabBarIcon: () => <Icon name="user" size={24} />,
          }}
          name="HomeProfileEvent"
          component={HomeProfileEvent}
        />
      </Tab.Navigator>
    );
  };
}
