import React from "react";
import { View,Text,Image } from "react-native";
import tw from 'twrnc';
export default function Card({temp,date,weatherStatus})
{
    const refineData=date.split(' ')[0].split('-')[2];

    return(
        <View   style={tw` justify-between  items-center  flex flex-row`}>
            <Text style={tw` text-white text-[16px]`}>
                date{refineData}
                 {'\n'}
                {Math.trunc(temp)}° c
                
            </Text>
            <Image style={{ width: 70, height: 70 } } source={require('../asset/cloud.png')}/>
        </View>
    )
}