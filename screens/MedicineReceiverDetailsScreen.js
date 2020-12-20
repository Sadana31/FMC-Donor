import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity, Alert, Image} from 'react-native';
import {Card,Header,Icon,Avatar} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';
import {RFValue} from 'react-native-responsive-fontsize';

export default class MedicineReceiverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userID          : firebase.auth().currentUser.email,
      userName        : "",
      receiverID      : this.props.navigation.getParam('details')["requesterID"],
      requestID       : this.props.navigation.getParam('details')["requestID"],  
      itemName        : this.props.navigation.getParam('details')["name"],
      type: this.props.navigation.getParam('details')["type"],
      imageURL: "#",
      receiverName    : '',
      receiverContact : '',
      receiverAddress : '',
      receiverRequestDocID : ''
    }
  }

getReceiverDetails(){
  db.collection('users').where('emailID','==',this.state.receiverID).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        receiverName    : doc.data().firstName,
        receiverContact : doc.data().contact,
        receiverAddress : doc.data().address,
      })
    })
  });

  db.collection('requestedMedicines').where('requestID','==',this.state.requestID).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({receiverRequestDocID:doc.id})
   })
})}

updateitemStatus=()=>{
  db.collection('allDonations').add({
    itemName           : this.state.itemName,
    requestID          : this.state.requestID,
    requestedby        : this.state.receiverName,
    donorID            : this.state.userID,
    requeststatus      :  "Donor (" + this.state.donorID + ") sent the item"
  })
}

addNotification=()=>{
  var message = this.state.userName + " has sent you the item"
  db.collection("allNotifications").add({
    "targeted_user_ID"    : this.state.receiverID,
    "donorID"            : this.state.userID,
    "requestID"          : this.state.requestID,
    "itemName"           : this.state.itemName,
    "date"                : firebase.firestore.FieldValue.serverTimestamp(),
    "notificationStatus" : "unread",
    "message"             : message
  })
}

componentDidMount(){
  this.getReceiverDetails()
}

deleteDoc=()=>{
  db.collection("requestedMedicines").doc(this.state.receiverRequestDocID).delete()
  .then(()=>{
    console.log("deleted")
  })
  .catch((error)=>{
    console.error("Error removing document: ", error);
  })
}

 alert=()=>{
  return  Alert.alert(
    'Are you sure you want to Donate?',
    '',
    [
      {text: 'YES', onPress: () => this.handleFunctions()},
      {text: 'NO', onPress: () => this.props.navigation.navigate("Donate")}
    ]
  );
 }

 handleFunctions=()=>{
  this.updateitemStatus()
  this.addNotification()
  this.deleteDoc()
  this.props.navigation.navigate('DonateScreen')
 }

 fetchImage = (imageName) => {
  var storageRef = firebase
    .storage().ref().child("userPrescriptions/" + imageName);
  storageRef
    .getDownloadURL()
    .then((url) => {
      this.setState({ imageURL: url });
    })
    .catch((error) => {
      this.setState({ imageURL: "#" });
    });
};

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
        <Header
            leftComponent ={<Icon name='arrow-left' type='feather' 
            color='white'  onPress={() => this.props.navigation.navigate("DonateScreen")}/>}
            centerComponent={{text: "Request Details", 
                style:{fontWeight: "bold", fontSize: 20, color: "white"}}}
            backgroundColor = "#0080ff"
          />
        </View>
        <View>
          <Card containerStyle={[styles.card,{marginTop: 80}]}
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            { this.state.itemName == ""
            ?(
              <Card >
              <Text>Name of item not given by user</Text>
              </Card>
            )
            :(
              <Card >
              <Text>Name : {this.state.itemName}</Text>
              </Card>
            )
            }
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 25, textAlign:"center", textDecorationLine: "underline"}}>
                Image of prescription
              </Text>
              { this.state.imageURL == "#"
                ?(
                  <Text style={{fontSize: 20, textAlign:"center", marginTop: 5}}>
                    User has not uploaded a prescription
                  </Text>
                )
                :(
                  <Image style={{width:500, height:500, alignSelf: "center"}} 
                  source={{uri: this.state.imageURL}}/>
                )
              }
            </View>
          </Card>
        </View>

        <View style={{marginTop:10}}>
          <Card containerStyle={[styles.card,{marginTop: 50}]}
            title={"Receiver Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text>Name: {this.state.receiverName}</Text>
            </Card>
            <Card>
              <Text>Contact: {this.state.receiverContact}</Text>
            </Card>
            <Card>
              <Text>Address: {this.state.receiverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.receiverID !== this.state.userID
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.alert()
                  }}>
                <Text>Send Item</Text>
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
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
  },
  card: {
    borderColor: "darkblue",
    borderRadius: 5,
    borderWidth: 3,

  }
})