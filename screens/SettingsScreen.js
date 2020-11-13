import * as React from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            firstName: "",
            lastName: "",
            address: "",
            contact: "",
            docID: ""
        }
    }

    getUserDetails=()=>{
        db.collection("users").where("emailID","==",this.state.userID).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    userID : doc.data().emailID,
                    firstName : doc.data().firstName,
                    lastName : doc.data().lastName,
                    address : doc.data().address,
                    contact : doc.data().contact,
                    docID : doc.id
                })
            })
        })
    }

    componentDidMount(){
        this.getUserDetails();
    }

    updateUserDetails=()=>{
        db.collection("users").doc(this.state.docID)
        .update({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            contact: this.state.contact,
            address: this.state.address,
            emailID: this.state.emailID,
        })
    }

    render(){
        return(
            <View>
                <MyHeader text="Settings"  navigation={this.props.navigation}/>

                <Text style={styles.header}>FIRST NAME</Text>
                <TextInput onChangeText={(text)=>{
                    this.setState({
                        firstName: text
                    })
                }}
                value={this.state.firstName}
                maxLength={8}/>

                <Text style={styles.header}>LAST NAME</Text>
                <TextInput onChangeText={(text)=>{
                    this.setState({
                        lastName: text
                    })
                }}
                value={this.state.lastName}
                maxLength={8}/>
                
                <Text style={styles.header}>CONTACT</Text>
                <TextInput onChangeText={(text)=>{
                    this.setState({
                        contact: text
                    })
                }}
                value={this.state.contact}
                maxLength ={10}
                keyboardType={'numeric'}
                />

                <Text style={styles.header}>ADDRESS</Text>
                <TextInput onChangeText={(text)=>{
                    this.setState({
                        address: text
                    })
                }}
                multiline={true}
                value={this.state.address}/>

                <Text style={styles.header}>E-MAIL ID</Text>
                <TextInput onChangeText={(text)=>{
                    this.setState({
                        userID: text
                    })
                }}
                value={this.state.emailID}/>

                <TouchableOpacity onPress={this.updateUserDetails()} style={styles.button}>
                    <Text style={styles.buttonText}>UPDATE</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    header: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        color: "blue"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        marginTop: 3
    },
    button: {
        backgroundColor: "#0080ff",
        borderRadius: 10,
        width: 200,
        margin: 10,
        height: "7%"
    }
})