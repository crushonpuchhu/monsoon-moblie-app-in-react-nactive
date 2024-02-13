import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import tw from 'twrnc';
import Card from './src/Card';
import Geolocation from 'react-native-geolocation-service';

function App() {
  const [wData, SetWeatherdata] = useState(null);
  const [wDataForcast, SetWeatherdataForcast] = useState([]);


  const Permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Loction Permission',
          message:
            'App needs access to your Loction ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Loction');
      } else {
        console.log('Camera permission Loction');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    Permission();
    const time = setInterval(() => {

      Geolocation.getCurrentPosition(async (postion) => {

        try {
          // current weather
          const link1 = `https://api.openweathermap.org/data/2.5/weather?lat=${postion.coords.latitude}&lon=${postion.coords.longitude}&appid=a363d45a072022cd84fc736fee4e0bf7&units=metric`;
          const WeatherData = fetch(link1, { method: 'GET', headers: { 'Content-Type': 'application/json;charset=utf-8' } })

          //  console.log(WeatherData);
          //  forcast weather
          const link2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${postion.coords.latitude}&lon=${postion.coords.longitude}&appid=a363d45a072022cd84fc736fee4e0bf7&units=metric`;
          const WeatherDataforcast = fetch(link2, { method: 'GET', headers: { 'Content-Type': 'application/json;charset=utf-8' } })

          const res = await Promise.all([WeatherData, WeatherDataforcast])
          const resfinal = await Promise.all([res[0].json(), res[1].json()])

          SetWeatherdata(resfinal[0]);



          const forcastArray = resfinal[1].list.filter((e, i) => {
            return e.dt_txt.includes('03:00:00');
          })

          forcastArray.shift()
          SetWeatherdataForcast(forcastArray)


        }
        catch (error) {
          console.log(error)
        }

      })

    }, 1000);

    return () => { clearInterval(time) }


  }, [])


  return (
    <SafeAreaView style={tw`justify-evenly p-5 gap-5 items-center  bg-[#133fdd] bg-emerald-600 flex   h-[100%] w-[100%] `}>
      {/* first box */}

      <View style={tw` flex  flex-row justify-start  items-center gap-10 h-[100px] w-[100%] `}>
        <Image style={{ width: 100, height: 100 }} source={require('./asset/cloud.png')} />
        <Text style={tw`font-normal text-5xl text-[#fefeff]`} >
          {wData !== null ? Math.trunc(wData.main.temp) : "0"}°c
        </Text>
      </View>
      {/* second box */}
      <View style={tw`w-[100%]  `}>
        <View style={tw`flex justify-start p-3 gap-2 items-end flex-row `}>
          <Text style={tw`font-bold  text-[32px] text-white tracking-wider `}>
            {wData !== null ? wData.name : "Serching..."}
          </Text>
          <Text style={tw`text-emerald-800 py-1 font-bold text-[15px]`}>
            AM
          </Text>
        </View>

        <View style={tw` p-1  px-3`}>
          <Text style={tw` text-white font-bold`}>
            Wind speed {wData !== null ? Math.trunc(wData.wind.speed) : "0"}km/h | Humidity: {wData !== null ? Math.trunc(wData.main.humidity) : "0"}%
          </Text>
        </View>

      </View>
      {/* third box */}

      <View style={tw`p-5 flex justify-center gap-3  bg-[#133fdd] bg-emerald-700 shadow-lg  rounded-3xl  w-[100%] `}>

        {
          wDataForcast.map((e, i) => {
            return <Card key={i} temp={e.main.temp} weatherStatus={e.weather[0].description} date={e.dt_txt} />
          })
        }
      </View>


    </SafeAreaView>
  )
}
export default App;