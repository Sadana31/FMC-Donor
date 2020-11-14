import * as React from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class FoodRequestScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            emailID: firebase.auth().currentUser.email,
            gender: "",
            clothSize: "",
            clothName: "",
            synopsis: ""
        }
    }

    addClothRequest=()=>{
        db.collection("requestedItems").add({
            "name": this.state.clothName,
            "type": "cloth",
            "synopsis": this.state.synopsis,
            "requesterID": this.state.emailID,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "requestID": this.createUniqueId()
        })
        return Alert.alert("Cloth requested successfully!!");
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }
    
    render(){
        return(
            <View>
                <MyHeader text="CLOTHES"  navigation={this.props.navigation}/>
                <TextInput placeholder="Enter type or name of cloth" style={styles.input1}
                onChangeText={(text)=>{
                    this.setState({clothName: text})
                }}/>

                <TextInput placeholder="Male or Female" style={styles.input1}
                onChangeText={(text)=>{
                    this.setState({gender: text})
                }}/>

                <TextInput placeholder="Enter size" style={styles.input1}
                onChangeText={(text)=>{
                    this.setState({clothSize: text})
                }}/>

                <TextInput placeholder="Any other preferences (optional)" 
                style={[styles.input1, {}]}
                onChangeText={(text)=>{
                    this.setState({synopsis: text})
                }}/>

                <TouchableOpacity style={styles.button} 
                onPress={()=>{
                    this.addClothRequest();
                    this.setState({
                        clothName: "",
                        clothSize: "",
                        gender: "",
                        synopsis: "",
                    })
                }}>
                    <Text style={styles.buttonText}>REQUEST CLOTH</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input1: {
        borderWidth: 3,
        borderColor: "#0080ff",
        width: "90%",
        margin: 20,
        marginTop: 40,
        borderRadius: 10,
        textAlign: "center",
        height: "10%",
        fontWeight: "bold",
        fontSize: 18
    },
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