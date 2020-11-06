import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import {UserContext} from './UserContext';

const Login = ({navigation}) => {
  const {user} = useContext(UserContext);

  useEffect(() => {
    if(user){
      navigation.navigate('Home')
    }
  }, [user])

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [spinner, setSpinner] = useState(false);

  const handleSubmit = ()=> {
    if (login.length > 0 && password.length > 0){
      setSpinner(true);

      auth().signInWithEmailAndPassword(login, password)
        .catch(error => {
          setSpinner(false);
          
          if (error.code === 'auth/invalid-email' || 
              error.code === 'auth/user-not-found' ||
              error.code === 'auth/wrong-password'
              ){
            Alert.alert(
              'Błąd',
              'Podano niepoprawny email lub hasło.',
              [{
                text: 'Ok',
                style: 'cancel'
              }],
              {cancelable: true},
            )
          } else if (error.code === 'auth/unknown'){
            Alert.alert(
              'Wystąpił błąd',
              'Sprawdź swoje połączenie z internetem.',
              [{
                text: 'Ok',
                style: 'cancel'
              }],
              {cancelable: true},
            )
          }
        });
    } else {
      Alert.alert(
        'Brak danych',
        'Pola "Login" i "Hasło" nie mogą pozostać puste.',
        [{
          text: 'Ok',
          style: 'cancel'
        }],
        {cancelable: true},
      )
    }
  }

  return(
    <>
      <View style={styles.container}>
        <Spinner visible={spinner}/>
        <Text style={styles.text}>Zaloguj się</Text>
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={login}
          onChangeText={text => setLogin(text)}
        />
        <TextInput
          placeholder="Hasło"
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.loginbtn}
          onPress={() => {
            handleSubmit()
          }}>
            <Text style={styles.loginText}>Zaloguj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerbtn}>
            <Text style={styles.registerText}>Załóż konto</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#131313',
    alignItems: 'center'
  },
  input:{
    backgroundColor: 'white',
    margin: 10,
    width: 300,
    borderRadius: 20,
    padding: 10,
    fontFamily: 'Ubuntu-Regular',
    textAlign: 'center'
  },  
  text:{
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Ubuntu-Light',
      fontSize: 24,
      marginTop: 60,
      marginBottom: 30
  },
  loginText:{
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
  loginbtn:{
    width: 150,
    backgroundColor: '#39e36f',
    padding: 10,
    marginTop: 25,
    borderRadius: 20
  },
  registerText:{
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
  registerbtn:{
    width: 100,
    marginTop: 35
  }
});

export default Login;