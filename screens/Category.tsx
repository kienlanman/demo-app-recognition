
import axios from 'axios';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import ProductListItem from '../components/ProductListItem'
import { SearchBar } from 'react-native-elements';

export default class Category extends React.Component<any, any> {
  
  constructor(props: any){
    super(props);
    this.state = {
      voiceInfo: [
      ],
      voiceInfoClone: [
      ],
      search: ""
    }
  }

  updateSearch = (_search: string) => {
    this.setState({ search:_search? _search: "" });
    const listDataFilter = this.state.voiceInfoClone.filter(x => x.name.toLowerCase().includes(_search.toLocaleLowerCase()))
    this.setState({
      voiceInfo: listDataFilter
    })
  };

  searchVoice = (_name?: string) => {
    axios.get('voice/search', {
      params: {
        name: _name
      }
    }).then (res => {
      this.setState({
        voiceInfo: res.data,
        voiceInfoClone: res.data
      })
    }).catch (error => {
      console.error(error);
    })
  }

  componentDidMount() {
    this.searchVoice();
  }

  deleteVoice = (id: any) => {
    axios.delete(`voice/delete/${id}`)
      .then(res => {
        console.log("Xoa thanh cong");
        Alert.alert(
          "Thông báo",
          "Xóa giọng thành công",
          [
            { text: "OK" }
          ],
          { cancelable: false }
        );
        this.searchVoice();
      })
  }

  render() {
    const {navigation} = this.props;
    const { search } = this.state;
    return <>
        <TouchableOpacity
            onPress={() => navigation.navigate('Add', {searchVoice: this.searchVoice})}
            style={styles.button}>
            <Text style={styles.buttonText}>Thêm giọng</Text>
          </TouchableOpacity>
        <SearchBar
          placeholder="Tìm kiếm..."
          onChangeText={this.updateSearch}
          value={search}
          platform="ios"
        />
        <FlatList data={this.state.voiceInfo}
          numColumns={1}
          renderItem={({item}) =>  <View style={styles.wrapper}>
            <ProductListItem key={item.id} product={item} deleteVoice={this.deleteVoice}/>
          </View>}
          keyExtractor={item => item.objectId.toString()}
          contentContainerStyle={styles.container}
          onMomentumScrollEnd={() => this.searchVoice()}
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
