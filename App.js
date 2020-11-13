import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import WelcomeScreen from './screens/WelcomeScreen';
import {BottomTabNavigator} from './components/BottomTabNavigator';
import { AppDrawer } from './components/AppDrawer'

export default function App() {
  return (
    <AppContainer />
  )
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: {screen: WelcomeScreen},
  Drawer:{screen: AppDrawer},
  BottomTab: {screen: BottomTabNavigator}
})

const AppContainer = createAppContainer(switchNavigator)
