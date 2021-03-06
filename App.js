import axios from "axios";
import * as Location from "expo-location";
import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";

const API_KEY = "54a52fa4980f1e80530f2c4cbe579c51";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    const condition = this.setCondition(weather[0].main);
    this.setState({ isLoading: false, temp, condition });
    console.log("hello");
  };
  getLocation = async () => {
    try {
      // throw Error
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find your permission", "So You need Allow Permission");
    }
  };

  setCondition = condition => {
    const atomsphereCondition = [
      "Mist",
      "Smoke",
      "Haze",
      "Dust",
      "Fog",
      "Sand",
      "Ash",
      "Squll",
      "Tornado"
    ];
    atomsphereCondition.map(con => {
      if (con === condition) {
        condition = "Atmosphere";
      }
    });
    return condition;
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
