import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import logo from '../assets/logo/logo.png';

const Header = ({user}) => {
  return(
    <View style={styles.header}>
      <Image source={logo} style={styles.logo}/>

      {user ?
        <TouchableOpacity
          style={styles.logoutbtn}
          onPress={() => { auth().signOut().catch(err => console.log(err))}}>
            <Text style={styles.logoutText}>Wyloguj</Text>
        </TouchableOpacity>
        :
        null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  header:{
    height: 60,
    backgroundColor: '#39e36f',
    color: 'white',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  logo:{
    width: 40,
    height: 40,
    marginLeft: 10
  },
  logoutbtn:{
    backgroundColor: '#39c959',
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  logoutText:{
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  }
});

export default Header;