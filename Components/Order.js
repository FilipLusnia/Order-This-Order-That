import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Spinner from 'react-native-loading-spinner-overlay';
import {UserContext} from './UserContext';

const Order = ({navigation}) => {
    const {user} = useContext(UserContext);
    const [name, setName] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [inputList, setInputList] = useState([{ item: "", amount: "" }]);

    if(user){
        firestore().collection('users').doc(user?.uid).get()
        .then(e=> setName(e.data().name));
    }

    const handleInputChange = (text, i, name) => {
        const list = [...inputList];
        list[i][name] = text;
        setInputList(list);
    };

    const handleRemoveClick = i => {
        const list = [...inputList];
        list.splice(i, 1);
        setInputList(list);
    };
   
    const handleAddClick = () => {
        setInputList([...inputList, { item: "", amount: "" }]);
    };

    const handleSubmit = () => {
        setSpinner(true);
        const filteredList = inputList.filter(item => item.item.length > 0);
        if(name){
            let fcmToken = null;

            if(filteredList.length !== 0){
                firestore().collection("orders").add({
                    items: filteredList,
                    author: name,
                    state: 'awaiting',
                    time: new Date()
                })
                .then(
                    getFcmToken = async () => { fcmToken = await messaging().getToken() }
                )
                .then(
                    fetch('https://fcm.googleapis.com/v1/projects/order-this-order-that/messages:send HTTP/1.1', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': fcmToken
                        },
                        "message":{
                            "token": fcmToken,
                            "data":{},
                            "notification":{
                                "body":"This is an FCM notification message!",
                                "title":"FCM Message"
                            }
                        }  
                    }).then(e => console.log(e)).catch(e => console.log(e))
                )
                .then(
                    setSpinner(false),
                    navigation.navigate('Home')
                )
            } else {
                setSpinner(false),
                Alert.alert(
                    'Brak danych',
                    'Dodaj conajmniej jeden przedmiot.',
                    [{
                    text: 'Ok',
                    style: 'cancel'
                    }],
                    {cancelable: true},
                )
            }
        }
    };

    return(
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.container}>
                <Spinner visible={spinner}/>
                <Text style={styles.title}>Zamów</Text>
                <Text style={styles.orderHint}>... co tylko potrzebujesz! Tosty z ketchupem? Herbatkę? A może wydruk?</Text>
                <View>
                    <View style={styles.container}>
                        {inputList.map((e, i) => {
                            return(
                                <View style={styles.inputsContainer} key={i}>
                                    <TextInput
                                        placeholder="Przedmiot"
                                        value={e.item}
                                        style={styles.input}
                                        onChangeText={text => handleInputChange(text, i, 'item')}
                                    />
                                    <TextInput
                                        placeholder="Ilość"
                                        value={e.amount}
                                        keyboardType='numeric'
                                        style={styles.inputSmall}
                                        onChangeText={text => handleInputChange(text, i, 'amount')}
                                    />
                                    {inputList.length !== 1 && <TouchableOpacity onPress={() => handleRemoveClick(i)} style={styles.removebtn}><Text style={styles.removeText}>-</Text></TouchableOpacity>}
                                </View>
                            )
                        })}
                        <TouchableOpacity onPress={() => handleAddClick()} style={styles.addbtn}><Text style={styles.addText}>+</Text></TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSubmit()}
                            style={styles.approvebtn}>
                                <Text style={styles.approveText}>Zatwierdź</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={styles.cancelbtn}>
                                <Text style={styles.cancelText}>Anuluj</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
  }
  
  const styles = StyleSheet.create({
    contentContainer:{
        height: '100%'
    },
    container:{
      flex: 1,
      backgroundColor: '#131313',
      alignItems: 'center'
    },
    title:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Bold',
      marginTop: 30,
      marginBottom: 20,
      fontSize: 20,
      letterSpacing: 1
    },
    orderHint:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Light',
        fontSize: 14,
        marginBottom: 45,
        paddingLeft: 10,
        paddingRight: 10,
        letterSpacing: 1,
        lineHeight: 20
    },
    inputsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input:{
        backgroundColor: 'white',
        width: 200,
        borderRadius: 20,
        padding: 10,
        fontFamily: 'Ubuntu-Regular',
        textAlign: 'center'
    },
    inputSmall:{
        backgroundColor: 'white',
        margin: 10,
        width: 50,
        borderRadius: 100/2,
        padding: 10,
        fontFamily: 'Ubuntu-Regular',
        textAlign: 'center'
    },
    addText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20
    },
    addbtn:{
        width: 100,
        height: 40,
        backgroundColor: '#4ddf65',
        borderRadius: 100/2,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    removebtn:{
        width: 50,
        height: 50,
        backgroundColor: '#ff5151',
        borderRadius: 100/2,
        justifyContent: 'center',
        marginLeft: 30
    },
    removeText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20
    },
    approvebtn:{
        width: 150,
        backgroundColor: '#78d279',
        padding: 10,
        marginTop: 25,
        borderRadius: 20
    },
    approveText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
    },
    cancelbtn:{
        width: 150,
        backgroundColor: '#383838',
        padding: 10,
        marginTop: 15,
        marginBottom: 40,
        borderRadius: 20
    },
    cancelText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
    }
  });
  
export default Order;