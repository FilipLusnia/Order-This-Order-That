import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './UserContext';

const Home = ({navigation}) => {
    const {user} = useContext(UserContext);
    const [name, setName] = useState(null);

    const [orders, setOrders] = useState();

    useEffect(() => {
      if(user){
        const unsubscribe = firestore().collection('orders')
          .orderBy("time", "desc").onSnapshot(snapshot => {
            const downloadedOrders = [];
            snapshot.forEach(doc => downloadedOrders.push({order: doc.data(), id: doc.id}))
            setOrders(downloadedOrders);
          })
        return () => {
          unsubscribe()
        }
      }
    }, [firebase])

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
          {name ?
            <Text style={styles.title}>Witaj, {name}!</Text>
          :
            <></>
          }
          <TouchableOpacity
            onPress={() => navigation.navigate('Order')}
            style={styles.orderbtn}>
              <Text style={styles.orderbtnText}>Zamów</Text>
          </TouchableOpacity>
          
          <Text style={styles.ordersHint}>Kliknij na jedno z zamówień poniżej, aby zmienić jego status kolejno
            na: "<Text style={styles.ordersHintAwaiting}>Oczekujące na realizację</Text>", 
            "<Text style={styles.ordersHintInProgress}>W toku</Text>" i 
            "<Text style={styles.ordersHintDone}>Zrealizowane</Text>".
          </Text>
          <View>
            <Text style={styles.titleOrders}>Zamówienia</Text>
            {orders?.map(e => {
              return(
                  <TouchableOpacity style={styles.orderContainer} key={e.id}>
                    <Text style={styles.orderTitle}>Zamówienie od: <Text style={styles.orderTitleName}>{e.order.author}</Text></Text>
                    {e.order.items.map(item => {
                      return(
                        <Text key={item.item} style={styles.orderText}>{item.item}: {item.amount}</Text>
                      )
                    })}
                  </TouchableOpacity>
              )
            })}
          </View>
        </View>
    )
  }
  
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#131313'
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
      borderRadius: 20,
      height: 40,
      width: 180,
      justifyContent: 'center'
    },
    orderbtnText:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Regular',
      fontSize: 20
    },
    ordersHint:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Light',
      fontSize: 15,
      marginTop: 45,
      paddingLeft: 10,
      paddingRight: 10,
      letterSpacing: 1,
      lineHeight: 20
    },
    ordersHintAwaiting:{
      color: '#525252'
    },
    ordersHintInProgress:{
      color: '#ffdf2b'
    },
    ordersHintDone:{
      color: '#4ddf65'
    },
    titleOrders:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Bold',
      marginTop: 40,
      marginBottom: 15,
      fontSize: 20,
      letterSpacing: 1
    },
    orderContainer:{
      backgroundColor: '#242424',
      width: 350,
      borderRadius: 10,
      paddingTop: 15,
      paddingBottom: 15,
      marginTop: 15
    },
    orderTitle:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Bold',
      fontSize: 20,
      marginBottom: 20,
      letterSpacing: 1
    },
    orderTitleName:{
      color: '#39c959',
    },
    orderText:{
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Regular',
      fontSize: 17,
      textTransform: 'capitalize',
      margin: 3
    }
  });
  
export default Home;