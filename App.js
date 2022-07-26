import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import SplashScreen from './src/screens/Splash/SplashScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import HomeBottomNavigationRoute from './src/routers/HomeBottomNavigationRoute';
import HistoryEventScreen from './src/screens/HistoryEvent/HistoryEventScreen';
import DetailEvent from './src/screens/HistoryEvent/DetailEvent';
import AbsentScreen from './src/screens/Absent/AbsentScreen';
import AbsensiExternalParticipantScreen from './src/screens/Absent/AbsensiExternalParticipantScreen';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render = () => {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="SplashScreen"
              component={SplashScreen}
            />
            <Stack.Screen
              options={{
                title: 'Login',
              }}
              name="LoginScreen"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="HomeBottomNavigationRoute"
              component={HomeBottomNavigationRoute}
            />
            <Stack.Screen
              name="HistoryEventScreen"
              component={HistoryEventScreen}
            />
            <Stack.Screen name="DetailEvent" component={DetailEvent} />
            <Stack.Screen name="AbsentScreen" component={AbsentScreen} />
            <Stack.Screen
              name="AbsensiExternalParticipantScreen"
              component={AbsensiExternalParticipantScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
  };
}
