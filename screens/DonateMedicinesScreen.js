import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image} from 'react-native';
import { ListItem, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import {RFValue} from 'react-native-responsive-fontsize';

export default class MedicineDonateScreen extends Component{
  constructor(){
        super()
        this.state = {
          userID  : firebase.auth().currentUser.email,
          requesteditemsList : []
        }
      this.requestRef= null
      }
    
      getRequesteditemsList =()=>{
        this.requestRef = db.collection("requestedMedicines")
        .onSnapshot((snapshot)=>{
          var requesteditemsList = snapshot.docs.map((doc) => doc.data())
          this.setState({
            requesteditemsList : requesteditemsList
          });
        })
      }
    
      componentDidMount(){
        this.getRequesteditemsList()
      }
    
      componentWillUnmount(){
        this.requestRef();
      }
    
    keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.requesterID}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
              onPress ={()=>{
                this.props.navigation.navigate("MedicineReceiverDetailsScreen",{"details": item})
              }}
              >
              <Text style={{color:'#ffff'}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <Header
            leftComponent ={<Icon name='arrow-left' type='feather' 
            color='white'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{text: "Donate Medicines", 
                style:{fontWeight: "bold", fontSize: 20, color: "white"}}}
            backgroundColor = "#0080ff"
          />
        <View style={{flex:1}}>
          {
            this.state.requesteditemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>There are currently no requests</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requesteditemsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#0080ff",
  }
})