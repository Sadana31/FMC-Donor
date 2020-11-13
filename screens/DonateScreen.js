import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class DonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      userID  : firebase.auth().currentUser.email,
      requesteditemsList : []
    }
  this.requestRef= null
  }

  getRequesteditemsList =()=>{
    this.requestRef = db.collection("requestedItems")
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
        title={item.name}
        subtitle={"Type: " + item.type}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
              onPress ={()=>{
                this.props.navigation.navigate("ReceiverDetailsScreen",{"details": item})
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
          <MyHeader text="Donate items" navigation ={this.props.navigation}/>
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
    //borderRadius: 10,
  }
})