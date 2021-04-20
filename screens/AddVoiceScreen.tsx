import axios from 'axios';
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import RecordComponent from '../components/RecordComponent'

class AddVoiceScreen extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            voice: "",
        };
    }

    handleChange = (value: any, state: any) => {
        this.setState({ [state]: value })
    }


    addVoice = () => {
        const { navigation } = this.props;
        // destructure state
        const { name, voice } = this.state;
        var bodyFormData = new FormData();

        bodyFormData.append('voice', voice);
        bodyFormData.append('name', name);
        axios({
            method: 'post',
            url: 'voice/save',
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            console.log("Them thanh cong");
        })
        .catch(error => {
             //handle error
            console.error(error);
         });
         navigation.navigate('Details');
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Add New Voice</Text>

                <TextInput
                    style={styles.textBox}
                    onChangeText={(text) => this.handleChange(text, "name")}
                    placeholder="Full Name" />

                <View style={styles.buttonContainer}>
                    <RecordComponent setDataCallBack={(text: any) => this.handleChange(text, "voice")} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.addVoice}
                        style={{ ...styles.button, marginVertical: 0 }}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}



export default AddVoiceScreen;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    }
})