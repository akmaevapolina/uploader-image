import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const UpscaleInputs = ({ onPressButton, onSelectToggle1, onSelectToggle2 }) => {

    const [toggle1, setToggle1] = useState(0);
    const [toggle2, setToggle2] = useState(0);

    const options1 = ['Smooth', 'Detailed'];
    const options2 = ['2x', '4x', '8x', '16x'];

    const handleToggle1 = (index) => {
        setToggle1(index);
    };

    const handleToggle2 = (index) => {
        setToggle2(index);
    };

    useEffect(() => {
        if (typeof onSelectToggle1 === 'function' && typeof onSelectToggle2 === 'function') {
            onSelectToggle1(toggle1);
            onSelectToggle2(toggle2)
        }
    }, [toggle1, toggle2])

    return(
        <View className='flex-1 justify-center items-center'>
            <View className='w-562 h-71 rounded-22 bg-gray'>
                <View className='flex-1 flex-row items-center justify-center px-3'>
                    <View className='flex-row justify-center items-center'>
                        <View className='flex-row h-48 w-166 mr-15 border border-violet rounded-2xl overflow-hidden'>
                            {options1.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={toggle1 === index && styles.selectedOption}
                                    className='flex-1 justify-center items-center'
                                    onPress={() => handleToggle1(index)}>
                                    <Text style={[
                                        styles.fontFamilyArchivo,
                                        toggle1 == index && styles.selectedText
                                        ]} className=' text-black text-center fs-18 font-semibold'>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className='flex-row h-48 w-237 border border-violet rounded-2xl overflow-hidden'>
                            {options2.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={toggle2 === index && styles.selectedOption}
                                    className='flex-1 justify-center items-center'
                                    onPress={() => handleToggle2(index)}>
                                    <Text style={[
                                        styles.fontFamilyArchivo,
                                        toggle2 == index && styles.selectedText
                                        ]} className=' text-black text-center fs-18 font-semibold'>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className='w-107 h-48 rounded-40 justify-center bg-orange ml-15'>
                        <TouchableOpacity onPress={onPressButton}>
                            <Text style={styles.fontFamilyInter} className='font-black text-15 text-white text-center'>Upscale</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({

  fontFamilyArchivo: {
    fontFamily: "Archivo",
  },

  fontFamilyInter: {
    fontFamily: "Inter",
  },

  selectedOption: {
    backgroundColor: '#735FFA',
    color: '#FFFFFF',
  },

  selectedText: {
    color: '#FFFFFF'
  }
})

export default UpscaleInputs;
