import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import {Icon} from 'react-native-elements';

export default class NotificationsScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            allNotifications: []
        }
    }

    getNotifications=()=>{
        db.collection("allNotifications")
        .where("receiverID","==",this.state.userID)
        .where("notificationStatus","==","unread")
        .onSnapshot((snapshot)=>{
            var notifications = [];
            snapshot.forEach((doc)=>{
                var notification = doc.data();
                notification["docID"] = doc.id;
                notifications.push(notification);
            })
            this.setState({allNotifications: notifications});
        })
    }

    componentDidMount(){
        this.getNotifications()
    }

    renderItem = ({item,index}) =>{
        return (
          <ListItem
            key={index}
            leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
            title={item.name}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            subtitle={item.message}
            bottomDivider
            onLongPress={this.renderHiddenItem}
          />
        )
   }

   renderHiddenItem = () => (
    <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Text style={styles.backTextWhite}></Text>
        </View>
    </View>
    )

  keyExtractor = (item, index) => index.toString()

    render(){
        return(
            <View>
                <MyHeader text="Notifications"  navigation={this.props.navigation}/>

                <View style={{flex:0.9}}>
                    {
                        this.state.allNotifications.length === 0
                        ?(
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:25, textAlign: "center", marginTop: 700}}>
                                You have no notifications
                            </Text>
                        </View>
                        )
                        :(
                        <FlatList renderItem={this.renderItem}
                        data={this.state.allNotifications}
                        keyExtractor={this.keyExtractor}/>
                        )
                    }
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backTextWhite: {
        color: '#FFF',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#29b6f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightBtnRight: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
})