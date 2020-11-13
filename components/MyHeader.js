import * as React from 'react';
import {Header} from 'react-native-elements';
import {Icon} from 'react-native-elements';

export default class MyHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return (
            <Header 
            leftComponent={<Icon name="bars" type="font-awesome" color="white"
                            onPress={()=>this.props.navigation.toggleDrawer()}/>}
            centerComponent={{text: this.props.text, 
                style:{fontWeight: "bold", fontSize: 20, color: "darkblue"}}}
            backgroundColor="lightblue"
            navigation={this.props.navigation}/>
        )
    }
}