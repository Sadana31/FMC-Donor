import * as React from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class FoodRequestScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            emailID: firebase.auth().currentUser.email,
            foodName: "",
            synopsis: "",
            docID: "",
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addFoodRequest=()=>{
        db.collection("requestedItems").add({
            "name": this.state.foodName,
            "type": "food",
            "synopsis": this.state.synopsis,
            "requesterID": this.state.emailID,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "requestID": this.createUniqueId()
        })
        return Alert.alert("Food item requested successfully!!");
    }

    
    render(){
        return(
            <View>
                <MyHeader text="FOOD" navigation={this.props.navigation} />
                <TextInput placeholder="Enter name of food item" style={styles.input1}
                onChangeText={(text)=>{
                    this.setState({foodName: text})
                }}/>

                <TextInput 
                placeholder="Short description about the item or Why do you need it?" 
                style={[styles.input1, {height: "50%"}]}
                onChangeText={(text)=>{
                    this.setState({synopsis: text})
                }}
                multiline={true}/>

                <TouchableOpacity style={styles.button} 
                onPress={()=>{
                    this.addFoodRequest();
                    this.setState({
                        foodName: "",
                        synopsis: "",
                    })
                }}>
                    <Text style={styles.buttonText}>REQUEST FOOD ITEM</Text>
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
        margin: RFValue(20),
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
        fontSize: RFValue(15),
        marginTop: 6
    }
})