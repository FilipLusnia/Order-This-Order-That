import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './UserContext';

const Order = ({navigation}) => {
    const {user} = useContext(UserContext);
    const [name, setName] = useState(null);

    const [inputList, setInputList] = useState([{ item: "", amount: "" }]);

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

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Zamów </Text>
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
                    style={styles.approvebtn}>
                        <Text style={styles.approveText}>Zatwierdź</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.cancelbtn}>
                        <Text style={styles.cancelText}>Anuluj</Text>
                </TouchableOpacity>
        </View>
    )
  }
  
  const styles = StyleSheet.create({
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
        backgroundColor: '#d0a43b',
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
        marginTop: 20,
        borderRadius: 20
    },
    cancelText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
    }
  });
  
export default Order;