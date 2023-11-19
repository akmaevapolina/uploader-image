import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageUploader from './components/ImageUploader';
import MainComponent from './components/MainComponent'

import './styles.css'

export default function App() {

  const [imageUploaded, setImageUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageSelect = (imageUri) => {
    setSelectedImage(imageUri);
    setImageUploaded(true);
  };

  return (
    <View className='flex-1'>
      {imageUploaded ? (
        <MainComponent selectedImage={selectedImage} />
      ) : (
        <ImageUploader onImageSelect={handleImageSelect} />
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
