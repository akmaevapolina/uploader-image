import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';
import UpscaleInputs from './UpscaleInputs';

Font.loadAsync({
  'Archivo': require('/assets/fonts/Archivo.ttf'),
  'Inter': require('/assets/fonts/Inter.ttf'),
});

const UpscaleComponent = ({ selectedImage }) => {

    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const imageSizeRef = useRef({ width: 0, height: 0 });
    const [toggle1, setToggle1] = useState(0);
    const [toggle2, setToggle2] = useState(0);

    useEffect(() => {
        Image.getSize(selectedImage, (width, height) => {
            imageSizeRef.current = { width, height };
            setImageSize({ width, height });
        });
    }, [selectedImage]);

    const handleSelectToggle1 = (item) => {
        setToggle1(item)
    }

    const handleSelectToggle2 = (item) => {
        setToggle2(item)
    }

    const handleButtonClick = async () => {

        try {

            const responseData = await fetch('https://eouqhcijqenehm8.m.pipedream.net', {
                method: 'POST',
                body: JSON.stringify({
                    toggle1,
                    toggle2,
                    selectedImage
                }),
            });
            console.log('Server response:', responseData);
        } catch (error) {
            console.error(error);
        }
    };

  return (

    <View className='flex-1 justify-center items-center'>
        <View className='w-1134 h-816 bg-violet rounded-32 items-center pt-2'>
            <View style={styles.shadow} className='w-1118 h-702 bg-violet rounded-28 py-16 px-28 p-16'>
                <Image source={{ uri: selectedImage }} style={{ width: imageSize.width, height: imageSize.height }}/>
            </View>

            <UpscaleInputs onPressButton={handleButtonClick}
            onSelectToggle1={handleSelectToggle1}
            onSelectToggle2={handleSelectToggle2} />
        </View>
    </View>

  );
};

const styles = StyleSheet.create({

  shadow: {
    shadowColor: "#0000001A",
    shadowOffset: {
      width: 0,
      height: 24,
    },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: -4,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default UpscaleComponent;
