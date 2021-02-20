import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryListItem from './components/CategoryListItem'
import AppNavigator from './screens/AppNavigator'

export default class App extends React.Component<{},any> {
  constructor(props: any){
    super(props);
    this.state = {
      categories: [
        {id: 1, name: 'Hoa quả nổi giận 1'},
        {id: 2, name: 'Hoa quả nổi giận 2'},
        {id: 3, name: 'Hoa quả nổi giận 3'}
      ]
    }
  }

  render() {
    const { categories } = this.state;
    return (
      <AppNavigator/>
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
