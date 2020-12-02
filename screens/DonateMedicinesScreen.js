import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'

export default class MedicinesDonateScreen extends React.Component {

    constructor(){
        super();
        this.state = {
            requestedMedicinesList: []
        }
    }

    getMedicinalRequests=()=>{
        db.collection("requestedMedicines")
        .onSnapshot((snapshot)=>{
            var requestedMedicinesList = snapshot.docs.map((doc) => doc.data())
            this.setState({
              requestedMedicinesList : requestedMedicinesList
            });
          })
    }

    componentDidMount(){
        this.getMedicinalRequests();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>{
        return (
        <ListItem
            key={i}
            title={item.name}
            subtitle={"Requested by: " + item.requesterID}
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
            <View>
                <Header
                    leftComponent ={<Icon name='arrow-left' type='feather' 
                    color='white'  onPress={() => this.props.navigation.navigate("DonateScreen")}/>}
                    centerComponent={{text: "Donate items", 
                        style:{fontWeight: "bold", fontSize: 20, color: "white"}}}
                    backgroundColor = "#0080ff"
                />
                <View style={{flex:1}}>
                    {
                        this.state.requestedMedicinesList.length === 0
                        ?(
                        <View style={styles.subContainer}>
                            <Text style={{ fontSize: 20, marginTop: 650}}>
                                There are currently no medicinal requests
                            </Text>
                        </View>
                        )
                        :(
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.requestedMedicinesList}
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