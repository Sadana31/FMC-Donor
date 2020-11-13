import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class ReceivedItems extends Component{
  constructor(){
    super()
    this.state = {
      userID  : firebase.auth().currentUser.email,
      receiveditemsList : []
    }
  this.requestRef= null
  }

  getReceivedItemsList =()=>{
    this.requestRef = db.collection("requestedItems")
    .where('userID','==',this.state.userID)
    .where("itemStatus", '==','received')
    .onSnapshot((snapshot)=>{
      var receiveditemsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receiveditemsList : receiveditemsList
      });
    })
  }

  componentDidMount(){
    this.getReceivedItemsList()
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
        subtitle={item.itemstatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader text="My Received items" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receiveditemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>You haven't received any items yet</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receiveditemsList}
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
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
