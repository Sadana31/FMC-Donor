import React , {Component } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import {DrawerItems} from 'react-navigation-drawer';
import db from '../config';
import firebase from 'firebase';
import { render } from 'react-dom';
import * as ImagePicker from 'expo-image-picker';
import {Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class CustomSideBarMenu extends Component{
  constructor(){
      super();
      this.state = {
        userID: firebase.auth().currentUser.email,
        image: "#",
        name: "",
        docId: "",
    }
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({image: uri})
      this.uploadImage(uri, this.state.userID);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("userProfiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase.storage().ref()
      .child("userProfiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users").where("emailID", "==", this.state.userID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().firstName + " " + doc.data().lastName,
            docID: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userID);
    this.getUserProfile();
  }
    render(){
        return(
            <View style = {styles.container}>
              <View style={{flex: 0.5, alignItems: "center", backgroundColor: "lightblue"}}>  
                  <Avatar rounded
                  source={{
                    uri: this.state.image
                  }}
                  icon={{name: 'home', type: 'font-awesome'}}
                  size="xlarge"
                  onPress={()=>{this.selectPicture()}}
                  containerStyle={{marginTop: 50}}
                  showEditButton/>
                  <Text style={{fontWeight: "100", fontSize: 20, marginTop: 10}}>
                    {this.state.name}
                  </Text>
              </View>
                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>
                
                <Image source={require("../assets/donate-icon.png")}
                  style={{width: 200, height: 200, alignSelf: "center", marginTop: -200}} />

                <View style={styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton}
                        onPress={()=>{
                            this.props.navigation.navigate('WelcomeScreen')
                            firebase.auth().signOut()
                        }}>
                            <Icon name="logout" size={25} color="black" type="antdesign"
                            iconStyle={{marginBottom: 10}}/>
                            <Text style={{fontWeight: "bold", textAlign: "center"}}>Log Out</Text>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container : {
      flex:1
    },
    drawerItemsContainer:{
      flex:0.8
    },
    logOutContainer : {
      flex:0.2,
      justifyContent:'flex-end',
      paddingBottom:30
    },
    logOutButton : {
      height:30,
      width:'100%',
      justifyContent:'center',
      padding:10
    },
    logOutText:{
      fontSize: RFValue(30),
      fontWeight:'bold'
    }
  })