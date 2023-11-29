import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageUncroper from './components/ImageUncroper';
import UncropComponent from './components/UncropComponent'
import ImageUpscaler from './components/ImageUpscaler';
import UpscaleComponent from './components/UpscaleComponent';

import './styles.css'

export default function App() {

  const [imageToUncropUploaded, setImageToUncropUploaded] = useState(false);
  const [imageToUpscaleUploaded, setImageToUpscaleUploaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageToUncropSelect = (imageUri) => {
    setSelectedImage(imageUri);
    setImageToUncropUploaded(true);
  };

  const handleImageToUpscaleSelect = (imageUri) => {
    setSelectedImage(imageUri);
    setImageToUpscaleUploaded(true);
  };


  return (
    <View className='flex-1'>
      {imageToUncropUploaded ? (
        <UncropComponent selectedImage={selectedImage} />
      ) : (
        <ImageUncroper onImageSelect={handleImageToUncropSelect} />
      )}
      {imageToUpscaleUploaded ? (
        <UpscaleComponent selectedImage={selectedImage} />
      ) : (
        <ImageUpscaler onImageSelect={handleImageToUpscaleSelect} />
      )}
      
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
