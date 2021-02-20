import React, { Component } from 'react';
import { StyleSheet, View, Button, PermissionsAndroid } from 'react-native';
import { Buffer } from 'buffer';
// import Permissions from 'react-native-permissions';
// import * as Permissions from 'expo-permissions';
// import Sound from 'react-native-sound';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import * as FileSystem from "expo-file-system";
import axios from 'axios';
import CommonUltils from '../ultils/CommonUltils';


export default class Recognition extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      recording: null,
      uri: null
    };
  }

  setRecording = (value: any) => {
    this.setState({ recording: value })
  }

  startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
      await recording.startAsync();
      this.setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  stopRecording = async () => {
    console.log('Stopping recording..');
    // this.setRecording(undefined);
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

  playFileRecord = async (recording: Recording) => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
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
      url: 'http://192.168.1.8:5000/voice/send-voice',
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
          console.log("Gui voice thanh cong");
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
          title={this.state.recording ? 'Stop Recording' : 'Start Recording'}
          onPress={this.state.recording ? this.stopRecording : this.startRecording}
        />
        <Button
          title={'Uploading record'}
          onPress={this.uploadAudio}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});