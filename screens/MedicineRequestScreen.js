import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView,
  TouchableOpacity, StyleSheet,
  Alert } from 'react-native';
  import { Avatar } from "react-native-elements";
import MyHeader from '../components/MyHeader';
import Carousel from 'react-native-snap-carousel';
import firebase from 'firebase';
import db from '../config';
import * as ImagePicker from 'expo-image-picker';
import {RFValue} from 'react-native-responsive-fontsize';

export default class MedicineRequestScreen extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
          name: "",
          activeIndex:0,
          requestStatus: true,
          docID: "",
          requestID: "",
          image: "",
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
              margin: 30}}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>{item.title}</Text>
            <Text style={{marginTop: 10, fontSize: 18}}>{item.subTitle}</Text>
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
       this.fetchImage(imageName);
    })
  }

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage().ref().child("userPrescriptions/" + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  
    addRequest=()=>{
      var randomRequestId = this.createUniqueId()
      db.collection("requestedMedicines").add({
        "name": this.state.name,
        "requesterID": this.state.userID,
        "requestID": randomRequestId,
        "type": "medicine",
        "imageURL": this.state.image
      })
      this.setState({
        name :'',
        requestID: randomRequestId
      })
      return alert("Medicine Requested Successfully")
    }

    sendNotification=()=>{
      //to get the first name and last name
      db.collection('users').where('emailID','==',this.state.userID).get()
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
              var name =  doc.data().name
    
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

        return (
          <SafeAreaView style={{ alignItems: "center", flex: 1}}>

            <MyHeader text="Medicines" navigation={this.props.navigation}/>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', marginBottom: -10}}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.carouselItems}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  onSnapToItem = { 
                    index =>{ 
                    this.setState({name:this.state.carouselItems[index].title})
                  }}/>
            </View>

            <View >
              <Text style={styles.head}>
                If you are in need of any other medicines, 
                kindly upload a PRESCRIPTION given by a DOCTOR
              </Text>

              <Avatar rounded
                source={{ 
                uri: this.state.image
                }}
                size="xlarge"
                title="Img"
                onPress={()=>{this.selectPicture()}}
                alignSelf="center"
                showEditButton
                containerStyle={styles.avatar}/>

            <TouchableOpacity style={styles.button} 
            onPress={()=>{
              this.addRequest()
            }}>
              <Text style={styles.buttonText}>REQUEST</Text>
            </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      }

}

const styles = StyleSheet.create({
    head: {
        fontWeight: "bold",
        fontSize: 20,
        color: "darkblue",
        textAlign: 'center',
        margin: 7,
        padding: 5,
        marginTop: -30
    },
    button: {
      borderRadius: 10,
      backgroundColor: "#0080ff",
      width: 250,
      height: "10%",
      alignSelf: "center",
      marginTop: 20
  },
  buttonText: {
      textAlign: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 6
  },
  avatar: {
    alignSelf: "center"
  }
})