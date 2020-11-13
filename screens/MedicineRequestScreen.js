import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView,
  TouchableOpacity, StyleSheet } from 'react-native';
  import { Avatar } from "react-native-elements";
import MyHeader from '../components/MyHeader';
import Carousel from 'react-native-snap-carousel';
import firebase from 'firebase';
import db from '../config';
import * as ImagePicker from 'expo-image-picker';

export default class MedicineRequestScreen extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
          nameOfMedicine: "",
          activeIndex:0,
          requestStatus: true,
          docID: "",
          requestID: "",
          userID: firebase.auth().currentUser.email,
          carouselItems: [
          {
              title:"Crocin",
              subTitle: "(Paracetomal for children) For fever"
          },
          {
              title:"Dolo 650",
              subTitle: "For fever(adults)"
          },
          {
              title:"Antiseptic Cream",
              subTitle: "Emergency purposes"
          },
          {
              title:"Diapers",
              subTitle: "For infants"
          },
          {
              title:"Band Aid",
              subTitle: "Emergency Purposes"
          },
          {
            title: "Choose any one item",
            subTitle: "Kindly stop at the item you want"
          }
        ],
      }
    }

    _renderItem({item,index}){
        return (
          <TouchableOpacity style={{
              backgroundColor:'lightgreen',
              borderRadius: 5,
              height: 250,
              padding: 50,
              marginTop: 50,
              marginLeft: 35,
              marginRight: 25,
             marginBottom: 50 }}
              >
            <Text style={{fontSize: 25, fontWeight: "bold"}}>{item.title}</Text>
            <Text style={{marginTop: 10}}>{item.subTitle}</Text>
          </TouchableOpacity>

        )
    }

    selectPicture=async()=>{
              const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
              }) 
              if(! cancelled){
                this.uploadImage(uri,this.state.userID);
              }
            }
          
  uploadImage=async(uri,imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child("userPrescriptions/" + imageName);
    return ref.put(blob).then((response)=>{
       alert("Image upload successful");
    })
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  
    addRequest=()=>{
      var randomRequestId = this.createUniqueId()
      db.collection("requestedItems").add({
        "nameOfMedicine": this.state.nameOfMedicine,
        "requesterID": this.state.userID,
        "requestID": randomRequestId,
      })
      db.collection("users").doc(this.state.docID).update({
        hasRequestedForMedicine: true
      })
      this.setState({
        nameOfMedicine :'',
        requestID: randomRequestId
    })
    return Alert.alert("Medicine Requested Successfully")
    }

    receivedItems=(name)=>{
      var userId = this.state.userID
      var requestId = this.state.requestID
      db.collection('receivedItems').add({
          "userID": userId,
          "name":bookName,
          "requestID"  : requestId,
          "Status"  : "received",
    
      })
    }

    getDocID=()=>{
      db.collection("users").where("emailID","==",this.state.userID).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({docID: doc.id})
        })
      })
    }

    componentDidMount=()=>{
      this.getDocID();
      this.getRequestStatus();
    }

    getRequestStatus=()=>{
      db.collection("users").where("emailID","==",this.state.userID).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({requestStatus: doc.data().hasRequestedForMedicine})
        })
      })
    }

    updateRequestStatus=()=>{
      db.collection('users').where('emailID','==',this.state.userId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection('users').doc(this.state.docID).update({
            hasRequestedForMedicine: false
          })
        })
      })
    }

    sendNotification=()=>{
      //to get the first name and last name
      db.collection('users').where('emailID','==',this.state.userId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var name = doc.data().firstName
          var lastName = doc.data().lastName
    
          // to get the donor id and book name
          db.collection('allNotifications')
            .where('requestID','==',this.state.requestId).get()
          .then((snapshot)=>{
            snapshot.forEach((doc) => {
              var donorId  = doc.data().donorID
              var name =  doc.data().nameOfMedicine
    
              //targert user id is the donor id to send notification to the user
              db.collection('allNotifications').add({
                "targeted_user_id" : donorId,
                "message" : name +" " + lastName + " received the medicine " + bookName ,
                "notificationStatus" : "unread",
                "name" : name
              })
            })
          })
        })
      })
    }
    render() {

      if(this.state.getRequestStatus){
        return(
              <View>
              <MyHeader title="Medicines" navigation={this.props.navigation}/>

              <Text style={[styles.head,{marginTop: 100}]}>
                You already have an existing medicinal request
              </Text>

              <TouchableOpacity style={styles.button}
              onPress={()=>{
                this.sendNotification();
                this.updateRequestStatus();
                this.receivedItems(this.state.nameOfMedicine);
              }}>
                <Text style={styles.buttonText}>I received the medicine</Text>
              </TouchableOpacity>
            </View>
        )
      }
      else {
        return (
          <SafeAreaView style={{flex: 1, alignItems: "center", marginBottom: -170}}>

            <MyHeader text="Medicines" navigation={this.props.navigation}/>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.carouselItems}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  onSnapToItem = { 
                    index =>{ 
                    this.setState({nameOfMedicine:index})
                    console.log(this.state.carouselItems[index].title);
                  }} />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={styles.head}>
                If you are in need of any other medicines, 
                kindly upload a PRESCRIPTION given by a PROPER DOCTOR
              </Text>

              <Avatar rounded
                source={{ 
                uri: this.state.image
                }}
                size="xlarge"
                title="med"
                fontSize="10"
                onPress={()=>{this.selectPicture()}}
                alignSelf="center"
                showEditButton
                containerStyle={styles.avatar}/>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>REQUEST</Text>
            </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      }
    }
}

const styles = StyleSheet.create({
    head: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 50,
        color: "darkblue",
        textAlign: 'center',
        margin: 7,
        padding: 5
    },
    button: {
      borderRadius: 10,
      backgroundColor: "#0080ff",
      width: "60%",
      height: "10%",
      alignSelf: "center",
      marginTop: -200
  },
  buttonText: {
      textAlign: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 15,
      marginTop: 6
  },
  avatar: {
    marginBottom: 200,
    alignSelf: "center"
  }
})