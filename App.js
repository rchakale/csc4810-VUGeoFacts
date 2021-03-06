import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { AsyncStorage } from 'react-native';
const buildings = require("./buildings.json");

export default class App extends Component {
  async componentDidMount(){
    try{
      /*await AsyncStorage.clear();
      console.log(buildings[0]);*/
      const time = await AsyncStorage.getItem("timeStamp");
      if(time == null){
        await AsyncStorage.setItem("timeStamp", new Date().toLocaleString());
        await AsyncStorage.multiSet([["Ceer", JSON.stringify(buildings[0])], ["Bartley", JSON.stringify(buildings[1])], ["Mendel", JSON.stringify(buildings[2])], ["Falvey", JSON.stringify(buildings[3])]]);
      }
    }
    catch(error){
    }
  }

  render(){
    return (
      <View style={styles.container}>
          <Home/>
      </View>
    );
  }
}

class Home extends Component{
  constructor(props){
    super(props);
    var timeStamp = new Date().toLocaleString();
    this.state = {date: timeStamp, inputLongitude: '', inputLatitude: '', latitude: '', longitude: '', building: '', fact: '', dataTime: ''};

    this.buttonPress= this.buttonPress.bind(this);
    this.onChangeLong = this.onChangeLong.bind(this);
    this.onChangeLat = this.onChangeLat.bind(this);
    this.distance = this.distance.bind(this);
    this.randomFact = this.randomFact.bind(this);
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.updateLatLong(position.coords.latitude, position.coords.longitude);
      },
      (error) => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  onChangeLong(long){
    this.setState({inputLongitude: long});
  }

  onChangeLat(lat){
    this.setState({inputLatitude: lat});
  }

  async buttonPress() {
    try{
      var ceer = await AsyncStorage.getItem("Ceer");
      var bartley = await AsyncStorage.getItem("Bartley");
      var mendel = await AsyncStorage.getItem("Mendel");
      var falvey = await AsyncStorage.getItem("Falvey");
      console.log(ceer);
      ceer = JSON.parse(ceer);
      console.log(ceer);
      bartley = JSON.parse(bartley);
      mendel = JSON.parse(mendel);
      falvey = JSON.parse(falvey);
    }
    catch (error){
    }

    var distCeer = this.distance(this.state.longitude, this.state.latitude, ceer["Longitude"], ceer["Latitude"]);
    var distBartley = this.distance(this.state.longitude, this.state.latitude, bartley["Longitude"], bartley["Latitude"]);
    var distMendel = this.distance(this.state.longitude, this.state.latitude, mendel["Longitude"], mendel["Latitude"]);
    var distFalvey = this.distance(this.state.longitude, this.state.latitude, falvey["Longitude"], falvey["Latitude"]);

    var distances = [distCeer, distBartley, distMendel, distFalvey];
    console.log(distances);
    var minimum = Math.min(...distances);
    distances ={"Ceer": distCeer, "Bartley": distBartley, "Mendel": distMendel, "Falvey": distFalvey};

    var minBuild;
    for(var key in distances){
      if (distances[key] == minimum){
        minBuild = key;
      }
    }

    try{
      var building = await AsyncStorage.getItem(minBuild);
      building = JSON.parse(building);
    }
    catch (error){
    }
    var randFact = this.randomFact(building.Facts);

    try{
      var time = await AsyncStorage.getItem("timeStamp");
    }
    catch (error){}

    this.setState({building: minBuild, fact: randFact, dataTime: time})
  }

  distance(inputLongitude, inputLatitude, buildLong, buildLat){
    var dist = Math.sqrt(Math.pow(inputLongitude-buildLong, 2) + Math.pow(inputLatitude-buildLat, 2));
    return dist;
  }

  randomFact(facts){
    var random = Math.floor(Math.random() * facts.length);
    return facts[random];
  }

  render(){
    return(
      <View>
          <View style={styles.container}>
            <Text style={styles.title}>Villanova University Interactive Tour</Text>
            <Text> </Text>
            <Button style={styles.button} onPress={this.buttonPress} title="Tell Me About My Location"/>
            <Text> {this.state.longitude} </Text>
            <Text> {this.state.latitude} </Text>
            <Text> {this.state.building} </Text>
            <Text> {this.state.fact} </Text>
            <Text> {this.state.dataTime} </Text>
          </View>
          <View style={styles.timestamp}>
            <Text> {this.state.date} </Text>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timestamp: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: 70,
    fontSize: 15,
  },

  inputBox: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 15,
  },

  title: {
    alignItems: 'center',
    fontSize: 20,
    color: '#0000FF',
  },

  image: {
    flex: 1,
   resizeMode: "cover",
   justifyContent: "center"
  }
});
