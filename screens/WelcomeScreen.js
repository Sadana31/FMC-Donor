import React,{Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView} from 'react-native';
import {Header} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends React.Component{
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'',
      firstName:'',
      lastName:'',
      address:'',
      contact:'',
      confirmPassword:'',
      modalVisible:'false'
    }
  }

  login=(emailId, password)=>{
    firebase.auth().signInWithEmailAndPassword(emailId, password)
    .then(()=>{
      this.props.navigation.navigate("DonateScreen");
    })
    .catch((error)=>{
      //Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return Alert.alert(errorMessage)
    })
  }

  signUp=(emailId, password, confirmPassword)=>{
    if(password !== confirmPassword){
      return Alert.alert("Passwords do not match")
    }
    else{
      firebase.auth().createUserWithEmailAndPassword(emailId, password)
      .then(()=>{
        db.collection('users').add({
          first_name:this.state.firstName,
          last_name:this.state.lastName,
          contact:this.state.contact,
          email_id:this.state.emailId,
          address:this.state.address
        })
        return  Alert.alert(
          'User Added Successfully',
          '',
          [
            {text: 'OK', onPress: () => this.setState({modalVisible : false})},
          ]
        );
      })
      .catch((error)=> {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage)
      });
    }
  }

  showModal=()=>{
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        >
        <View style={styles.modalContainer}>
          <ScrollView style={{width:'100%'}}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView} behavior="margin" enabled>
            <Text
              style={styles.modalTitle}
              >Sign Up here!!</Text>
            <TextInput
              style={styles.formInput}
              placeholder ={"First Name"}
              maxLength ={8}
              onChangeText={(text)=>{
                this.setState({
                  firstName: text
                })
              }}
            />
            <TextInput
              style={styles.formInput}
              placeholder ={"Last Name"}
              maxLength ={8}
              onChangeText={(text)=>{
                this.setState({
                  lastName: text
                })
              }}
            />
            <TextInput
              style={styles.formInput}
              placeholder ={"Contact"}
              maxLength ={10}
              keyboardType={'numeric'}
              onChangeText={(text)=>{
                this.setState({
                  contact: text
                })
              }}
            />
            <TextInput
              style={styles.formInput}
              placeholder ={"Address"}
              multiline = {true}
              onChangeText={(text)=>{
                this.setState({
                  address: text
                })
              }}
            />
            <TextInput
              style={styles.formInput}
              placeholder ={"Email"}
              keyboardType ={'email-address'}
              onChangeText={(text)=>{
                this.setState({
                  emailId: text
                })
              }}
            /><TextInput
              style={styles.formInput}
              placeholder ={"Password"}
              secureTextEntry = {true}
              onChangeText={(text)=>{
                this.setState({
                  password: text
                })
              }}
            />
            <TextInput
              style={styles.formInput}
              placeholder ={"Confrim Password"}
              secureTextEntry = {true}
              onChangeText={(text)=>{
                this.setState({
                  confirmPassword: text
                })
              }}
            />
            <View style={styles.modalBackButton}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={()=>{
                  if(this.state.firstName===undefined || this.state.lastName === undefined ||
                  this.state.contact===undefined || this.state.address ===undefined ||
                  this.state.emailId===undefined || this.state.password===undefined ||
                  this.state.confirmPassword===undefined){
                    console.log("Check")
                    return Alert.alert("Please fill in all the details!!")
                  }
                  else{ 
                    console.log("uncheck")
                    this.signUp(this.state.emailId, this.state.password, 
                      this.state.confirmPassword)
                    }
                  }
                }
              > 
              <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBackButton}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={()=>{this.setState({modalVisible:false})}}
              >
              <Text style={styles.registerButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  render(){
    return(
      <KeyboardAvoidingView
        style={{flex: 1, alignItems: "center"}} behavior="margin" enabled>
        {this.showModal()}
        <Header 
            centerComponent={{text: "FMC Donor", 
                style:{fontWeight: "bold", fontSize: 20, color: "darkblue"}}}
            backgroundColor="lightblue"
            navigation={this.props.navigation}/>
        <View style={{borderWidth: 2, marginTop: 20, 
          borderRadius: 15, borderColor: "blue", padding: 20}}>
            <Text style={styles.head}>Welcome to FMC DONOR: </Text>
            <Text style={styles.head}>an app where you can donate</Text>
            <Text style={styles.head}>food, medicine & clothes!! </Text>
        </View>

        <View style={{alignItems: "center", flex: 1}}> 
          <TextInput style={[styles.input, {marginTop:30}]}
          keyboardType="email-address"
            placeholder="Enter your email"
            onChangeText={(text)=>{
              this.setState({emailId: text})
            }}
          />

          <TextInput style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text)=>{
              this.setState({password: text})
            }}
          />

          <TouchableOpacity style={styles.button}
          onPress={()=>{this.login(this.state.emailId, this.state.password)}} >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
          onPress={()=>this.setState({ modalVisible:true})} >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          <Image source={require("../assets/logo.png")}
          style={{width: 200, height: 200, marginTop: 20}}/>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  input: {
      width: 300,
      height: "8%",
      borderBottomWidth: 3,
      backgroundColor: "white",
      fontSize: 20,
      margin:15,
      paddingLeft:10,
      alignSelf: "center",
      textAlign: "center",
      fontWeight: "bold"
  },
  formInput:{
      width:"75%",
      height:"6%",
      alignSelf:'center',
      borderColor:'#000099',
      borderRadius:10,
      borderWidth:2,
      marginTop: 20,
      padding: 10,
      textAlign: "center",
      fontWeight: "bold"
    },
  button: {
      backgroundColor: "#0080ff",
      borderRadius: 10,
      width: 200,
      margin: 10,
      height: "7%"
  },
  head: {
      margin: 5,
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      color: "#0080ff"
  },
  buttonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 20,
      marginTop: 3
  },
  modalContainer: {
      flex:1,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ccffcc",
      marginRight:30,
      marginLeft : 30,
      marginTop: 80,
      marginBottom: 80,
  },
  registerButton:{
      width: 200,
      height: 40,
      alignItems:'center',
      justifyContent:'center',
      borderWidth:1,
      borderRadius:10,
      marginTop: 30,
      alignSelf: "center"
    },
    registerButtonText:{
      color:'#ff5722',
      fontSize:15,
      fontWeight:'bold'
    },
    cancelButton:{
      width:200,
      height:40,
      alignItems:'center',
      justifyContent:'center',
      borderWidth:1,
      borderRadius:10,
      marginTop: 30,
      alignSelf: "center"
    },
    modalTitle :{
      justifyContent:'center',
      alignSelf:'center',
      fontSize:30,
      color:'#000066',
      margin:15,
      fontWeight: "bold"
    },
})
