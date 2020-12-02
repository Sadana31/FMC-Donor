import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import DonateMedicinesScreen from '../screens/DonateMedicinesScreen';
import MedicineReceiverDetailsScreen from '../screens/MedicineReceiverDetailsScreen';
import Donate from '../screens/Donate';

export default MedicineStack = createStackNavigator({
    DonateScreen: {
        screen: Donate,
        navigationOptions: {
            headerShown: false
        }
    },
    DonateMedicinesScreen: {
        screen: DonateMedicinesScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    MedicineReceiverDetailsScreen: {
        screen: MedicineReceiverDetailsScreen,
        navigationOptions: {
            headerShown: false
        }
    }
},
{
    initialRouteName: "DonateMedicinesScreen"
})