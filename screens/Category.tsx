
import axios from 'axios';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import ProductListItem from '../components/ProductListItem'

export default class Category extends React.Component<any, any> {
  
  constructor(props: any){
    super(props);
    this.state = {
      voiceInfo: [
      ]
    }
  }

  searchVoice = () => {
    axios.get('http://192.168.1.8:5000/voice/search').then (res => {
      this.setState({
        voiceInfo: res.data
      })
    }).catch (error => {
      console.error(error);
    })
  }

  componentDidMount() {
    this.searchVoice();
  }

  deleteVoice = (id: any) => {
    axios.delete(`http://192.168.1.8:5000/voice/delete/${id}`)
      .then(res => {
        console.log("Xoa thanh cong");
        this.searchVoice();
      })
  }

  render() {
    const {navigation} = this.props;
    return <>
        <TouchableOpacity
            onPress={() => navigation.navigate('Add')}
            style={styles.button}>
            <Text style={styles.buttonText}>Thêm giọng</Text>
          </TouchableOpacity>
        <FlatList data={this.state.voiceInfo}
          numColumns={1}
          renderItem={({item}) =>  <View style={styles.wrapper}>
            <ProductListItem key={item.id} product={item} deleteVoice={this.deleteVoice}/>
          </View>}
          keyExtractor={item => item.objectId.toString()}
          contentContainerStyle={styles.container}
          onMomentumScrollEnd={this.searchVoice}
        />
    </>
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 8
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
});
