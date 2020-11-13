import * as React from 'react';
import {Text, View, StyleSheet, TextInput, 
TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import db from '../config';
import {Header,Icon,Card} from 'react-native-elements';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            receiverID: this.props.navigation.getParam("details")["userID"],
            requestID: this.props.navigation.getParam("details")["requestID"],
            itemName: this.props.navigation.getParam("details")["itemName"],
            reasonForRequesting: this.props.navigation.getParam("details")["reasonToRequest"],
            receiverName: "",
            receiverContact: "",
            receiverAddress: "",
            receiverRequestDocID: "",
            userName: ""
        }
    }

    getDonorDetails=(userID)=>{
        db.collection("users").where("emailID","==", userID).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "userName" : doc.data().firstName + " " + doc.data().lastName
            })
          });
        })
      }

    getReceiverDetails(){
        db.collection("users").where("emailID","==",this.state.receiverID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName: doc.data().firstName,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address,
                })
            })
        })
        db.collection("requestedItems").where("requestID","==",this.state.requestID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({receiverRequestDocID: doc.id});
            })
        })
    }

    componentDidMount(){
        this.getReceiverDetails();        
        this.getDonorDetails(this.state.userID);
    }

    updateItemStatus=()=>{
        db.collection("allDonations").add({
            itemName: this.state.itemName,
            requestID: this.state.requestID,
            requestedBy: this.state.receiverName,
            donorID: this.state.userID,
            requestStatus: "Donor sent the item"
        })
    }

    addNotification=()=>{
        var message = this.state.userName + " has sent you the item"
        db.collection("allNotifications").add({
          "receiverID"    : this.state.receiverID,
          "donorID"            : this.state.userID,
          "requestID"          : this.state.requestID,
          "itemName"           : this.state.itemName,
          "date"                : firebase.firestore.FieldValue.serverTimestamp(),
          "notificationStatus" : "unread",
          "message"             : message
        })
      }

      deleteDocument=()=>{
        db.collection("requestedItems").doc(this.state.receiverRequestDocID).delete()
        .then(()=>{
            console.log("Document deleted")
        })
        .catch((error)=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage);
        })
      }

    render(){
        return (
            <View style={styles.container}>
                <View style={{flex: 0.1}}>
                    <Header 
                    leftComponent={<Icon name="arrow-left" type="feather"
                                    color="white" 
                                    onPress={()=>this.props.navigation.goBack()}/>}
                    centerComponent={{text: "Donate Items",
                                    style: {color: "white", fontSize: 20, fontWeight: "bold"}}}
                    backgroundColor = "darkblue"/>
                </View>

                <View style={{flex: 0.8, 
                                marginTop: 80, 
                                backgroundColor: "lightblue", 
                                borderWidth: 3,
                                margin: 10,
                                borderRadius: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 18, textAlign: "center"}}>
                        ITEM DESCRIPTION
                    </Text>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>NAME: {this.state.itemName}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>TYPE: {this.state.type}</Text>
                    </Card>
                </View>

                <View 
                style={styles.box}>
                    <Text 
                    style={{fontWeight: "bold", fontSize: 18, textAlign: "center"}}>
                        RECEIVER INFORMATION
                    </Text>
                    <Card>
                            <Text style={{fontWeight: "bold"}}>NAME: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>CONTACT: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>ADDRESS: {this.state.receiverAddress}</Text>
                        </Card>
                </View>

                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverID !== this.state.userID
                        ? (
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                            this.updateItemStatus();
                            this.addNotification();
                            this.deleteDocument();
                            this.props.navigation.navigate("DonateScreen");
                            }}>
                                <Text style={styles.buttonText}>
                                    Send item
                                </Text>
                            </TouchableOpacity>
                        )
                        : null
                    }
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
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
    },
    box: {
        flex: 1, 
        marginTop: 40, 
        backgroundColor: "orange", 
        borderWIDth: 3,
        margin: 10,
        borderRadius: 10}
  })