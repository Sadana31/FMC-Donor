import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class ReceiverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userID          : firebase.auth().currentUser.email,
      userName        : "",
      receiverID      : this.props.navigation.getParam('details')["requesterID"],
      requestID       : this.props.navigation.getParam('details')["requestID"],  
      itemName        : this.props.navigation.getParam('details')["name"],
      type: this.props.navigation.getParam('details')["type"],
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

  db.collection('requestedItems').where('requestID','==',this.state.requestID).get()
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


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' 
            color='white'  onPress={() => this.props.navigation.goBack()}/>}
            cecenterComponent={{text: this.props.text, 
                style:{fontWeight: "bold", fontSize: 20, color: "darkblue"}}}
            backgroundColor = "lightblue"
          />
        </View>
        <View style={styles.card}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.type}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.card}>
          <Card
            title={"Receiver Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.receiverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.receiverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.receiverAddress}</Text>
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
                    this.updateitemStatus()
                    this.addNotification()
                    this.props.navigation.navigate('DonateScreen')
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
    flex: 0.8, 
    marginTop: 80, 
    backgroundColor: "lightblue", 
    borderWidth: 3,
    margin: 10,
    borderRadius: 10
  }
})