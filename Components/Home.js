import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './UserContext';

const Home = ({navigation}) => {
    const {user} = useContext(UserContext);
    const [name, setName] = useState(null);

    useEffect(() => {
        if(user){
          firestore().collection('users').doc(user?.uid).get()
          .then(e=> setName(e.data().name))
        }
        if(!user){
            navigation.navigate('Login')
            setName(null)
        }
    }, [user, name])

    return(
        <View style={styles.container}>
          <Text style={styles.title}>Witaj, {name}!</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Order')}
            style={styles.orderbtn}>
              <Text style={styles.orderText}>Zamów</Text>
          </TouchableOpacity>
        </View>
    )
  }
  
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#131313'
    },
    orderBtn:{
      marginTop: 30,
      width: 90
    },
    title:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Bold',
      marginTop: 20,
      fontSize: 20,
      letterSpacing: 1
    },
    orderbtn:{
      width: 150,
      backgroundColor: '#589f46',
      padding: 10,
      marginTop: 25,
      borderRadius: 20
    },
    orderText:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Regular',
    }
  });
  
export default Home;