import * as React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MyHeader from '../components/MyHeader';

export default class Donate extends React.Component {
    render(){
        return(
            <View style={{flex: 1, alignItems :"center"}}>
                <MyHeader text="Donate Items" navigation={this.props.navigation}/>
                <TouchableOpacity onPress={()=>{
                    this.props.navigation.navigate("Medicines");
                }}
                style={[styles.button, {marginTop: 100}]}>
                    <Text style={styles.buttonText}>Medicines</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    this.props.navigation.navigate("Donate");
                }}
                style={styles.button}>
                    <Text style={styles.buttonText}>Others</Text>
                </TouchableOpacity>
            </View>        
        )
    }
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        backgroundColor: "#0080ff",
        width: "60%",
        height: "5%",
        alignSelf: "center",
        marginTop: 20
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
        marginTop: 6
    }
})