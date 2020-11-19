import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import {UserContext} from './UserContext';

const Home = ({navigation}) => {
    const {user} = useContext(UserContext);
    const [name, setName] = useState(null);

    const [orders, setOrders] = useState();
    const [orderSpinner, setOrderSpinner] = useState(false);
    
    const handleStatusChange = (e) => {
      setOrderSpinner(true)

      firestore().collection('orders').doc(e).get()
      .then(doc => {
        if(doc.data().state === 'awaiting'){
          firestore().collection('orders').doc(e).update({
            state: 'inProgress'
          })
          setOrderSpinner(false)
        }
        if(doc.data().state === 'inProgress'){
          firestore().collection('orders').doc(e).update({
            state: 'done'
          })
          setOrderSpinner(false)
        }
        if(doc.data().state === 'done'){
          firestore().collection('orders').doc(e).update({
            state: 'awaiting'
          })
          setOrderSpinner(false)
        }
      })
    }

    useEffect(() => {
      if(name){
        const unsubscribe = firestore().collection('orders').limit(5)
          .orderBy("time", "desc").onSnapshot(snapshot => {
            const downloadedOrders = [];
            snapshot.forEach(doc => downloadedOrders.push({order: doc.data(), id: doc.id}))
            setOrders(downloadedOrders);
          })
        return () => {
          unsubscribe()
        }
      }
    }, [firestore, name])

    useEffect(() => {
        if(user.uid){
          firestore().collection('users').doc(user.uid).get()
          .then(e=> setName(e.data().name))
        }
        if(!user.uid){
            navigation.navigate('Login')
            setName(null)
        }
    }, [user, name])

    return(
      <ScrollView contentContainerStyle={styles.contentContainer}>
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
          <Text style={styles.titleOrders}>Zamówienia</Text>
          <View style={styles.ordersListContainer}>
            {orders?.map(e => {
              return(
                  <TouchableOpacity onPress={() => handleStatusChange(e.id)} style={styles.orderContainer} key={e.id}>
                    <Spinner visible={orderSpinner}/>
                    <View style={styles.orderTop}>
                      <View style={{
                                    width: 25,
                                    height: 25,
                                    position: 'absolute',
                                    transform: [{translateX: 20}],
                                    borderRadius: 100/2,
                                    backgroundColor: e.order.state === 'awaiting' ? '#525252' : (e.order.state === 'inProgress' ? '#ffdf2b' : '#4ddf65')
                                  }}/>
                      <Text style={styles.orderTitle}>Zamówienie od: <Text style={styles.orderTitleName}>{e.order.author}</Text></Text>
                    </View>
                    {e.order.items.map(item => {
                      return(
                        <Text key={item.item} style={styles.orderText}>{item.item}{item.amount && ': '+item.amount}</Text>
                      )
                    })}
                  </TouchableOpacity>
              )
            })}
          </View>
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
      marginTop: 45,
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
      fontSize: 14,
      marginTop: 45,
      paddingLeft: 10,
      paddingRight: 10,
      letterSpacing: 1,
      lineHeight: 20
    },
    ordersHintAwaiting:{
      color: '#6b6b6b'
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
    ordersListContainer:{
      marginBottom: 25
    },
    orderContainer:{
      backgroundColor: '#242424',
      width: 350,
      borderRadius: 10,
      paddingTop: 15,
      paddingBottom: 15,
      marginTop: 15
    },
    orderTop:{
      position: 'relative'
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
      margin: 3
    }
  });
  
export default Home;