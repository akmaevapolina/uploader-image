import React, { useState } from 'react';

import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import * as Font from 'expo-font';
import Svg, { Path } from "react-native-svg"
import UncropInputs from './UncropInputs';


Font.loadAsync({
  'Archivo': require('/assets/fonts/Archivo.ttf'),
  'Inter': require('/assets/fonts/Inter.ttf'),
});

const ImageUncroper = ({ onImageSelect }) => {

    const [selectedImage, setSelectedImage] = useState(null);

    const options:ImageLibraryOptions = {
        mediaType:'photo',
    }

    const handleImageUpload = () => {
        launchImageLibrary(options, response => {
            if (response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                setSelectedImage(imageUri);
                onImageSelect(imageUri);
            }
        });
    };

    const handleButtonClick = () => {
        console.log('worked!')
    }

    return (
        <View className='flex-1 items-center justify-center'>
            <View className='bg-violet rounded-32 w-580 h-428'>
                <View className='items-center pt-2 pb-16'>
                    <View className='w-564 h-320 p-16 py-16 px-28 rounded-28 border-1-5 border-dashed border-white'>
                        <View className='items-center w-340 h-192 gap-8'>
                            <TouchableOpacity onPress={handleImageUpload}>
                                <View className='items-center w-20 h-20 rounded-128 bg-white justify-center' style={styles.shadow}>
                                    <View>
                                        <Svg width={32} height={32}viewBox='0 0 16 16'>
                                            <Path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                                            <Path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                        </Svg>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View className='w-340 h-20 gap-2 items-center justify-center'>
                                <Text style={styles.fontFamilyArchivo} className='text-40 font-semibold leading-48 tracking-min text-center text-white'>Upload file</Text>
                                <Text style={styles.fontFamilyInter} className='font-medium text-16 leading-6 text-center text-white'>To Uncrop</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <UncropInputs onPressButton={handleButtonClick} onSizeChange={null} width={null} height={null} onSelectItem={null} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({

    shadow: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 16,
        },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: -8,
    },

    fontFamilyArchivo: {
        fontFamily: "Archivo",
    },

    fontFamilyInter: {
        fontFamily: "Inter",
    },
});

export default ImageUncroper;
