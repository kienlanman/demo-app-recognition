import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryListItem from '../components/CategoryListItem'

export default class Categories extends React.Component<any,any> {
  constructor(props: any){
    super(props);
    this.state = {
      categories: [
        {id: 1, name: 'Hoa quả'},
        {id: 2, name: 'Sửa chua'},
        {id: 3, name: 'Hàng hóa'}
      ]
    }
  }

  render() {
    const { categories } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList data={categories}
          renderItem={({item}) =>  <CategoryListItem key={item.id} category={item} onPress={() => navigation.navigate('Details', {categoryName: item.name})}/>}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingLeft: 16, paddingRight: 16}}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16
  },
});
