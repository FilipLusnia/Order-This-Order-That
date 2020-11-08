import React, { useState, useEffect } from 'react';
import { View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
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

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken()
      console.log('Authorization status:', authStatus);
    }
  }

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
     console.log(fcmToken);
     console.log("Your Firebase Token is:", fcmToken);
    } else {
     console.log("Failed", "No token received");
    }
  }
  
  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
   }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
 
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

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
          <Stack.Screen name="Home" component={Home} initialParams={user} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Order" component={Order} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  )
}
export default App;