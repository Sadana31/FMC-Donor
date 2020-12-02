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

                <Text style={[styles.quote, {marginTop: 30}]}>
                    "No act of kindness, no 
                </Text>
                <Text style={styles.quote}>
                        no matter how small, is
                </Text>
                <Text style={styles.quote}>
                    is ever wasted..."" ya 
                </Text>
            </View>        
        )
    }
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        backgroundColor: "#66b2ff",
        width: "60%",
        height: "8%",
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 18,
    },
    quote: {
        fontWeight: "bold",
        fontSize :25,
        color: "blue",
        textAlign: "center",
    }
})