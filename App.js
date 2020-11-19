import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './Components/UserContext';
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Order from './Components/Order';

const App = () => {
  const Stack = createStackNavigator();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if(token && user){
      firestore().collection('users').doc(user?.uid).update({
        deviceToken: token
      })
    }
  }, [token, user]);
  
  useEffect(() => {
    const fetchToken = async () => {
      const aquiredToken = await messaging().getToken()
      if (aquiredToken){
        setToken(aquiredToken);
      }
    }
    fetchToken()

    const unsubscribe = messaging().onMessage(async e => {
      Alert.alert(e.notification.title, e.notification.body);
    });
    return unsubscribe;
   }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  if (initializing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#131313'}}>
        <Text style={{textAlign: 'center', color: 'white', fontSize: 17}}>Ładowanie...</Text>
      </View>
    );
  }

  return(
    <UserContext.Provider value={{user}}>
      <NavigationContainer>
        <Header user={user}/>
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Order" component={Order} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  )
}
export default App;