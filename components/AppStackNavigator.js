import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import DonateScreen from '../screens/DonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';

export default AppStackNavigator = createStackNavigator({
    DonateScreen: {
        screen: DonateScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ReceiverDetailsScreen: {
        screen: ReceiverDetailsScreen,
        navigationOptions: {
            headerShown: false
        }
    }
},
{
    initialRouteName: "DonateScreen"
})