import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MedicineRequestScreen from '../screens/MedicineRequestScreen';
import ClothesRequestScreen from '../screens/ClothesRequestScreen';
import FoodRequestScreen from '../screens/FoodRequestScreen';
import AppStackNavigator from '../components/AppStackNavigator';

export const BottomTabNavigator = createBottomTabNavigator({
  MedicineRequestScreen : {
    screen: MedicineRequestScreen,
    navigationOptions :{
      tabBarIcon: <Image source={require("../assets/med.png")} style={{width: 25, height: 25}}/>,
      tabBarLabel : "Medicine",
    }
  },
  ClothesRequestScreen : {
    screen: ClothesRequestScreen,
    navigationOptions :{
      tabBarIcon: <Image source={require("../assets/cloth.png")} style={{width: 30, height: 25}}/>,
      tabBarLabel : "Clothes",
    }
  },
  FoodRequestScreen : {
    screen: FoodRequestScreen,
    navigationOptions :{
      tabBarIcon: <Image source={require("../assets/food.png")} style={{width: 25, height: 25}}/>,
      tabBarLabel : "Food",
    }
  },
  DonateScreen : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon: <Image source={require("../assets/donate.png")} style={{width: 25, height: 25}}/>,
      tabBarLabel : "Donate Items",
    }
  },
});