import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useScrollToTop } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';

const Register = ({navigation}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const [spinner, setSpinner] = useState(false);

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const handleSubmit = ()=> {
    if (login.length > 0 && password.length > 0 && 
        password === repeatPassword && name.length > 0){
        setSpinner(true);

      auth().createUserWithEmailAndPassword(login, password)
        .then(resp => {
          return firestore().collection('users').doc(resp.user.uid).set({
            name: name
          })
        })
        .catch(error => {
          setSpinner(false);

          if (error.code === 'auth/invalid-email' || 
              error.code === 'auth/weak-password' ||
              error.code === 'auth/wrong-password'
              ){
            Alert.alert(
              'Błąd',
              'Email powinien być poprawnie sformatowany, a hasło powinno zawierać conajmniej 6 znaków.',
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
    } else if(password !== repeatPassword){
      Alert.alert(
        'Błąd',
        'Hasła nie są takie same',
        [{
          text: 'Ok',
          style: 'cancel'
        }],
        {cancelable: true},
      )
    } else {
      Alert.alert(
        'Brak danych',
        'Żadne pola nie mogą pozostać puste.',
        [{
          text: 'Ok',
          style: 'cancel'
        }],
        {cancelable: true},
      )
    }
  }

  return(
    <ScrollView ref={ref} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Spinner visible={spinner}/>
        <Text style={styles.text}>Zarejestruj się</Text>
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={login}
          onChangeText={text => setLogin(text)}
        />
        <TextInput
          placeholder="Hasło (conajmniej 6 znaków)"
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          placeholder="Potwierdź hasło"
          style={styles.input}
          value={repeatPassword}
          onChangeText={text => setRepeatPassword(text)}
        />
        <TextInput
          placeholder="Imię"
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TouchableOpacity
          style={styles.registerbtn}
          onPress={() => {
            handleSubmit()
          }}>
            <Text style={styles.registerText}>Zarejestruj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginbtn}>
            <Text style={styles.loginText}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer:{
    flexGrow:1
  },
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#131313'
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
  registerText:{
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
  registerbtn:{
    width: 150,
    backgroundColor: '#39e36f',
    padding: 10,
    marginTop: 25,
    borderRadius: 20
  },
  loginText:{
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
  loginbtn:{
    width: 100,
    marginTop: 35,
    marginBottom: 30
  }
});

export default Register;