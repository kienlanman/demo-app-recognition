import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';
// import Permissions from 'react-native-permissions';
// import * as Permissions from 'expo-permissions';
// import Sound from 'react-native-sound';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";
import { RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC, RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4, RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX } from 'expo-av/build/Audio';

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
    // const recordingOptions = {
    //   android: {
    //     extension: '.m4a',
    //     outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    //     audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    //     sampleRate: 44100,
    //     numberOfChannels: 2,
    //     bitRate: 128000,
    //   },
    //   ios: {
    //     extension: '.caf',
    //     audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    //     sampleRate: 44100,
    //     numberOfChannels: 2,
    //     bitRate: 128000,
    //     linearPCMBitDepth: 16,
    //     linearPCMIsBigEndian: false,
    //     linearPCMIsFloat: false,
    //   }
    // };
    // const res = JSON.parse(JSON.stringify(recordingOptions));
    try {
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
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
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
          title={this.state.recording ? 'Dừng' : 'Ghi âm'}
          onPress={this.state.recording ? this.stopRecording : this.startRecording}
        />
    );
  }
}

