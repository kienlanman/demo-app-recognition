import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';
// import Permissions from 'react-native-permissions';
// import * as Permissions from 'expo-permissions';
// import Sound from 'react-native-sound';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";


export default class RecordComponent extends Component<any, any> {

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
    const {setDataCallBack} = this.props;
    console.log('Stopping recording..');
    // this.setRecording(undefined);
    await this.state.recording.stopAndUnloadAsync();
    let uri = this.state.recording.getURI();
    if(uri == null) {
      uri = '';
    }
    let dataFile = null;
    await FileSystem.readAsStringAsync(uri.toString(), {encoding: FileSystem.EncodingType.Base64}).then(
      res => dataFile = res
    )
    setDataCallBack(dataFile)
    this.setRecording(null);
  }

  render() {
    return (
        <Button
          title={this.state.recording ? 'Stop Recording' : 'Start Recording'}
          onPress={this.state.recording ? this.stopRecording : this.startRecording}
        />
    );
  }
}

