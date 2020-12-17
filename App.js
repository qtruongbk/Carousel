import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView, Image, SafeAreaView, AsyncStorage,RefreshControl } from 'react-native';
import getDataFromAPI from './src/api';
import { FontAwesome5, Feather, AntDesign, MaterialIcons,Foundation,MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [person, setPerson] = useState([])
  const [personInfo, setPersonInfo] = useState(null);
  const [title, setTitle] = useState(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    getDataFromAPI().then(async data => {
      let dl = data.results[0].user
      await setPerson(dl);
      await showInfoPerson("people", dl.name.first + dl.name.last)
    })
  }, []);


  const showInfoPerson = (title, info) => {
    setPersonInfo(info)
    switch (title) {
      case "people":
        setStatus("people");
        setTitle(`My profile :`); break;
      case "calenda":
        setStatus("calenda");
        setTitle("Cell:"); break;
      case "location":
        setStatus("location");
        setTitle("My location is:"); break;
      case "phone":
        setStatus("phone");
        setTitle("My phone is:"); break;
      case "lock":
        setStatus("lock");
        setTitle("user:"); break;
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={(data) => {console.log(data);return
          if (data.nativeEvent.contentOffset.x >50) {
            getDataFromAPI().then(async data => {
              let dl = data.results[0].user;
              await setPerson(dl);
              await showInfoPerson("people", dl.name.first + " " + dl.name.last)
            })
          }
          if (data.nativeEvent.contentOffset.x <-50) {
            let myFavourite;
            AsyncStorage.getItem("favourite").then(fav => {
              myFavourite = fav;
              if (myFavourite == undefined) {
                AsyncStorage.setItem("favourite", JSON.stringify([person]))
              } else {
                let count = 0;
                myFavourite = JSON.parse(myFavourite)
                myFavourite.forEach(pers => {
                  if (pers.email == person.email) {
                    count++;
                  }
                })
                if (count != 0) { return } else {
                  AsyncStorage.setItem("favourite", JSON.stringify([...myFavourite, person]))
                  Alert.alert(`Đã lưu ${[...myFavourite, person].length} người vào danh sách ưa thích`)
                }
              }
            })
          }
        }}
        scrollEventThrottle={16}
        style={{ padding: 15 ,flex:1}}
      >
        <View style={styles.card}>
          <View style={styles.container}>
            <Image style={styles.avatar} source={{ uri: person.picture }} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, color: "gray" }}>{title}</Text>
              <Text style={{ fontSize: 28, maxWidth: 250,color:person.gender =="male"?"#4287f5":"#ff8095",textAlign:"center" }}>{personInfo}</Text>
              {status == "people" && person.gender =="female" && <Foundation name="female-symbol" size={45} color="#ff8095" />}
              {status == "people" && person.gender =="male" && <Foundation name="male-symbol" size={45} color="#4287f5" />}
            </View>
            <View style={styles.bottom}>
              <MaterialIcons name="person-outline" size={40} color="black"
                style={status == "people" ? styles.iconInfoPicked : styles.icon}
                onPress={() => showInfoPerson("people", person.name.first + " " + person.name.last)} />
              <MaterialCommunityIcons name="cellphone" size={40} color="black"
                style={status == "calenda" ? styles.iconInfoPicked : styles.icon}
                onPress={() => showInfoPerson("calenda", person.cell)} />
              <FontAwesome5 name="map-marked-alt" size={40} color="black"
                style={status == "location" ? styles.iconInfoPicked : styles.icon}
                onPress={() => showInfoPerson("location", `${person.location.street}, ${person.location.city}, ${person.location.state}`)} />
              <Feather name="phone-call" size={40} color="black"
                style={status == "phone" ? styles.iconInfoPicked : styles.icon}
                onPress={() => showInfoPerson("phone", person.phone)} />
              <AntDesign name="lock1" size={40} color="black"
                style={status == "lock" ? styles.iconInfoPicked : styles.icon}
                onPress={() => showInfoPerson("lock", `${person.username} \n ${person.email}`)} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  avatar: {
    width: 250,
    height: 250,
    borderRadius: 500,
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    padding: 10,
  },
  iconInfoPicked: {
    padding: 10,
    marginBottom:20,
    color: "green",
  },
  card: {
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 20,
  }
});
