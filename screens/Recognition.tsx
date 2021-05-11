import React, { Component } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
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
      isStop: false
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

  playingRecord = async () => {
    console.log("play", this.state.uri)
    try {
      const {
        sound: soundObject,
        status,
      } = await Audio.Sound.createAsync(this.state.uri, { shouldPlay: true });
      await soundObject.playAsync();
      // Your sound is playing!

      // Don't forget to unload the sound from memory
      // when you are done using the Sound object
    } catch (error) {
    }
  }

  playBase64Audio = async () => {
    // Write the Base64 to a new location
    const recording = this.state.recording as Recording;
    let uri = recording.getURI();
    if(uri == null) {
      uri = '';
    }
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

  playFileRecord = async (recording: Recording) => {
    const { sound, status } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: false,
        volume: 1.0,
        rate: 1.0,
        shouldCorrectPitch: true,
      },
    );
    console.log(`Stop and play sound`);
    sound.playAsync();
  }

  uploadAudio = async () => {
    const recording = this.state.recording as Recording;
    var bodyFormData = new FormData();
    let uri = recording.getURI();
    if(uri == null) {
      uri = '';
    }
    let dataFile = null;
    await FileSystem.readAsStringAsync(uri.toString(), {encoding: FileSystem.EncodingType.Base64}).then(
      res => dataFile = res
    )
    if(dataFile == null){
      dataFile = '';
    }
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
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
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
