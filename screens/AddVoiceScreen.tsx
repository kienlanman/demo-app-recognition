import axios from 'axios';
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import RecordComponent from '../components/RecordComponent'
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";

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
        const { navigation, route } = this.props;
        // destructure state
        const { name, voice } = this.state;
        if(!voice){
            Alert.alert(
                "Thông báo",
                "Bạn chưa nói giọng nào",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            return;
        }
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
            Alert.alert(
                "Thông báo",
                "Thêm giọng thành công",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            route.params?._searchVoice();
            console.log("Them thanh cong");
        })
        .catch(error => {
             //handle error
            console.error(error);
         });
         navigation.navigate('Details');
    };

    playBase64Audio = async () => {
        const { voice } = this.state;
        if(!voice){
            Alert.alert(
                "Thông báo",
                "Bạn chưa nói giọng nào",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            return;
        }
        // Write the Base64 to a new location
        const options = { encoding: FileSystem.EncodingType.Base64 };
        const testUri = FileSystem.documentDirectory + "demo_sound.mp3";
        await FileSystem.writeAsStringAsync(testUri, voice, options);
        // Enable audio on the device
        await Audio.setIsEnabledAsync(true);
        // Play audio from the new Base64, or from the original reference. <3
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync({ uri: testUri });
            await soundObject.setVolumeAsync(0.7);
            // await soundObject.loadAsync(resource);
            await soundObject.playAsync();
            // Your sound is playing!
        } catch (error) {
            console.log(error);
            // An error occurred!
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Thêm giọng mới</Text>

                <TextInput
                    style={styles.textBox}
                    onChangeText={(text) => this.handleChange(text, "name")}
                    placeholder="Tên" />

                <View style={styles.buttonContainer}>
                    <RecordComponent setDataCallBack={(text: any) => this.handleChange(text, "voice")} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.playBase64Audio}
                        style={{ ...styles.button, marginVertical: 0 }}>
                        <Text style={styles.buttonText}>Nghe lại</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.addVoice}
                        style={{ ...styles.button, marginVertical: 0 }}>
                        <Text style={styles.buttonText}>Thêm</Text>
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