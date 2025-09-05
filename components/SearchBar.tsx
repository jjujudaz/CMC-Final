import {View, Text, TextInput} from 'react-native';
import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

interface Props {
    placeholder: string;
    onPress?: () => void;
    value: string;
    onChangeText: (text:string) => void;
}

const SearchBar = ({placeholder, onPress, value, onChangeText}:Props) => {
    return (
        <View className={"flex-1 mt-4 mx-8 mb-5"}>
            <View
                className={
                    "flex-row items-center bg-white rounded-full px-5 h-16 border border-gray-400"
                }
            >
                <Ionicons name="search-outline" size={24} color="black" />

                <TextInput
                    className="flex-1 ml-2 font-Text text-lg font-normal text-gray-800"
                    textAlignVertical="center"
                    onPress={onPress}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}


                />
            </View>
        </View>

    )
}

export default SearchBar;