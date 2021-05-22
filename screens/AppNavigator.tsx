import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Category from '../screens/Category'
import Recognition from '../screens/Recognition'
import AddVoiceScreen from '../screens/AddVoiceScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';

function Second({navigation}:  {navigation: any}) {
    return (
        <Category navigation={navigation}/>
    );
}
function Add({navigation, route}: {navigation: any, route: any}) {
    return (
        <AddVoiceScreen navigation={navigation} route={route}/>
    );
}

function RecognitionScreen() {
    return (
        <Recognition/>
    );
}

const ListInfoStack = createStackNavigator();
const ListInfoStackScreen = () => {
    return <ListInfoStack.Navigator>
        {/* <ListInfoStack.Screen name="Home" component={HomeScreen} options={{title:"Trang chủ"}}/> */}
        <ListInfoStack.Screen name="Details" component={Second} options={{title:"Danh sách giọng"}}/>
        <ListInfoStack.Screen name="Add" component={Add} options={{title:"Thêm mới giọng"}}/>
    </ListInfoStack.Navigator>
}

const RecognitionStack = createStackNavigator();
const RecognitionStackScreen = () => {
    return <RecognitionStack.Navigator>
        <RecognitionStack.Screen name="Recognition" component={RecognitionScreen} options={{title:"Nhận diện"}}/>
    </RecognitionStack.Navigator>
}

const Tabs = createBottomTabNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tabs.Navigator
                 screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName ='';
          
                      if (route.name === 'RecognitionScreen') {
                        iconName = focused
                          ? 'ios-mic'
                          : 'ios-mic-outline';
                      } else if (route.name === 'ListInfoScreen') {
                        iconName = focused ? 'ios-list-outline' : 'ios-list';
                      }
          
                      // You can return any component that you like here!
                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                  })}
                  tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                  }}
            > 
                <Tabs.Screen name="RecognitionScreen" component={RecognitionStackScreen}/>
                <Tabs.Screen name="ListInfoScreen" component={ListInfoStackScreen}/>
            </Tabs.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

