import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {UserContext} from './UserContext';

const Home = ({navigation}) => {
    const {user} = useContext(UserContext);
    
    useEffect(() => {
        if(!user){
            navigation.navigate('Login')
        }
    }, [user])

    return(
        <View style={styles.container}>
          <Text>Witaj, {user?.uid}</Text>
        </View>
    )
  }
  
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#131313'
    },
    orderBtn:{
      marginTop: 30,
      width: 90
    }
  });
  
export default Home;