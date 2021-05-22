import React, { Component } from 'react';
import {ActivityIndicator, StyleSheet, View, Alert, Text } from 'react-native';
// import Permissions from 'react-native-permissions';
// import * as Permissions from 'expo-permissions';
// import Sound from 'react-native-sound';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import * as FileSystem from "expo-file-system";
import axios from 'axios';
import CommonUltils from '../ultils/CommonUltils';
import { Button, Icon } from 'react-native-elements'


export default class Recognition extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      recording: null,
      uri: null,
      isStop: false,
      isLoading: false
    };
  }

  componentDidMount = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
  }

  changeValueState = (value: any, nameState: any) => {
    this.setState({ [nameState]: value })
  }

  setRecording = (value: any) => {
    this.setState({ recording: value })
  }

  startRecording = async () => {
    try {
      this.changeValueState(true, "isStop");
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      this.setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  stopRecording = async () => {
    this.changeValueState(false, "isStop");
    console.log('Stopping recording..');
    // this.setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await this.state.recording.stopAndUnloadAsync();
    // this.setRecording(undefined);
  }

  playBase64Audio = async () => {
    // Write the Base64 to a new location
    const recording = this.state.recording as Recording;
    if(recording == null) {
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
    let uri = recording.getURI();
    uri =  uri ?? "";
    let fileBase64 = "";
    await FileSystem.readAsStringAsync(uri.toString(), {encoding: FileSystem.EncodingType.Base64}).then(
      res => fileBase64 = res
    )
    const options = { encoding: FileSystem.EncodingType.Base64 };
    const testUri = FileSystem.documentDirectory + "demo_sound.mp3";
    await FileSystem.writeAsStringAsync(testUri, fileBase64, options);
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

  uploadAudio = async () => {
    const recording = this.state.recording as Recording;
    if (recording == null) {
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
    this.setState({isLoading: true});
    var bodyFormData = new FormData();
    let uri = recording.getURI();
    uri =  uri ?? "";
    let dataFile = '';
    await FileSystem.readAsStringAsync(uri.toString(), {encoding: FileSystem.EncodingType.Base64}).then(
      res => dataFile = res
    )
    bodyFormData.append('file', dataFile);
    await axios({
      method: 'post',
      url: 'voice/send-voice',
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
          console.log("Gui voice thanh cong");
          const name = response.data;
          Alert.alert(
            "Thông báo",
            "Xin chào "+ name,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
      })
      .catch(function (response) {
          //handle error
          console.log("Gui voice that bai");
    });
    this.setState({isLoading: false});
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" animating={this.state.isLoading}/>
        <Button
          icon={
            this.state.isStop ? <Icon
              reverse
              name='ios-recording'
              type='ionicon'
              color='#517fa4'
              style={styles.middle}
              onPress={this.stopRecording}
            /> : <Icon
              reverse
              name='ios-recording-outline'
              type='ionicon'
              color='#517fa4'
              style={styles.middle}
              onPress={this.startRecording}
            />
          }
          onPress={this.state.isStop ? this.stopRecording : this.startRecording}
          type="clear"
        />
         <Button
          title={this.state.isStop ? 'Stop Recording' : 'Start Recording'}
          onPress={this.state.isStop ? this.stopRecording : this.startRecording}
          type="clear"
        />
        <Button
          title={'Nhận dạng'}
          onPress={this.uploadAudio}
          type="clear"
        />
         <Button
          title={'Nghe Lại'}
          onPress={this.playBase64Audio}
          type="clear"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  middle: {
    // textAlign:'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
