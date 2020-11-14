import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import AppStackNavigator from '../components/AppStackNavigator';
import DonateMedicinesScreen from '../screens/DonateMedicinesScreen';
import Donate from '../screens/Donate';
import App from '../App';

export default DonateStack = createStackNavigator({
    DonateScreen: {
        screen: Donate,
        navigationOptions: {
            headerShown: false
        }
    },
    Donate: {
        screen: AppStackNavigator,
        navigationOptions: {
            headerShown: false
        }
    },
    Medicines: {
        screen: DonateMedicinesScreen,
        navigationOptions: {
            headerShown: false
        }
    }
},
{
    initialRouteName: "DonateScreen"
})