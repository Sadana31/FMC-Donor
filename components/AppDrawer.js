import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer'; 
import { BottomTabNavigator } from '../components/BottomTabNavigator';
import CustomSideBarMenu  from './SideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReceivedItems from '../screens/ReceivedItems';
import {Icon} from 'react-native-elements';

export const AppDrawer = createDrawerNavigator({
  Home : {
    screen : BottomTabNavigator,
    navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome"/>,
        drawerLabel: "Home  "
    }
    },
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: {
        drawerIcon: <Icon name="notifications" size={30} color="black" />,
        drawerLabel: "Notifications  "
    }
  },
  MyReceivedItems: {
    screen: ReceivedItems,
    navigationOptions: {
        drawerIcon: <Icon name="card-giftcard" size={25} color="black"/>,
        drawerLabel: "My Received Items  "
    }
  },
  Setting : {
    screen : SettingsScreen,
    navigationOptions: {
        drawerIcon: <Icon name="settings" size={25} color="black" />,
        drawerLabel: "Settings  "
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })