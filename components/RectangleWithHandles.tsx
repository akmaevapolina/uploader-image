import React, { useState, useEffect, useRef } from 'react';
import { View, PanResponder, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import ImageComponent from './ImageComponent';
import ViewShot from 'react-native-view-shot'
import RNFS from 'react-native-fs'
import test from 'node:test';

const RectangleWithHandles = ({ widthValue, heightValue, onDimensionsChange, selectedImage, onCapture, setRectangleRef }) => {

  const triggerRectangleRequest = () => {
    postResponce
  };

  const [rectDimensions, setRectDimensions] = useState({
    width: 906,
    height: 585,
    x: 0,
    y: 0,
  });

  const [capturedUri, setCapturedUri] = useState(null)

  const maxWidth = 906; 
  const maxHeight = 585; 

  const viewShotRef = useRef(null)
  const imageSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (setRectangleRef) {
      setRectangleRef.current = {triggerRectangleRequest}
    }
  }, [setRectangleRef])


  useEffect(() => {
    const newWidth = parseInt(widthValue, 10) || 0;
    const newHeight = parseInt(heightValue, 10) || 0;
    setRectDimensions((prevDimensions) => ({
      ...prevDimensions,
      width: Math.min(newWidth, maxWidth),
      height: Math.min(newHeight, maxHeight),
    }));
  }, [widthValue, heightValue]);
  
    useEffect(() => {
    Image.getSize(selectedImage, (width, height) => {
      imageSizeRef.current = { width, height };
    });
  }, [selectedImage]);


  const handlePanResponderMove = (_, gestureState, handle) => {
    const { width, height } = Dimensions.get('window');

    let newWidth = rectDimensions.width;
    let newHeight = rectDimensions.height;
    let newX = rectDimensions.x;
    let newY = rectDimensions.y;

    switch (handle) {
      case 'top':
        newHeight -= gestureState.dy;
        newY += gestureState.dy;
        break;
      case 'bottom':
        newHeight += gestureState.dy;
        break;
      case 'left':
        newWidth -= gestureState.dx;
        newX += gestureState.dx;
        break;
      case 'right':
        newWidth += gestureState.dx;
        break;
    }

    newX = Math.max(0, Math.min(newX, width - newWidth, maxWidth - newWidth));
    newY = Math.max(0, Math.min(newY, height - newHeight, maxHeight - newHeight));

    if (newWidth > maxWidth) newWidth = maxWidth;
    if (newHeight > maxHeight) newHeight = maxHeight;

    if (newWidth < 0) newWidth = 0;
    if (newHeight < 0) newHeight = 0;

    setRectDimensions({ x: newX, y: newY, width: newWidth, height: newHeight });

    if (onDimensionsChange) {
      onDimensionsChange(newWidth, newHeight);
    }
  };

  const createHandlePanResponder = (handle) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => handlePanResponderMove(_, gestureState, handle),
    });
  };

 const postResponce = async () => {
      try {
      const { width: imageWidth, height: imageHeight } = imageSizeRef.current; 

    const aspectRatio = imageWidth / imageHeight;
    let captureWidth = rectDimensions.width;
    let captureHeight = rectDimensions.width / aspectRatio;

    if (captureHeight > rectDimensions.height) {
      captureHeight = rectDimensions.height;
      captureWidth = rectDimensions.height * aspectRatio;
    }

    const uri = await viewShotRef.current.capture({
      format: "jpg",
      quality: 0.9,
      result: "base64",
      snapshotContentContainer: false,
      region: {
        x: rectDimensions.x,
        y: rectDimensions.y,
        width: captureWidth,
        height: captureHeight,
      },
    });

    const formData = new FormData();
    formData.append('image', 'data:image/jpg;base64,${uri}'); 

    const response = await fetch('https://eogs0da8w0xs4aw.m.pipedream.net', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responseData = await response.json();
    console.log('Server responce:', responseData);

    if (onCapture) {
      onCapture(uri);
      setCapturedUri(uri);
    }
  } catch (error) {
    console.error(error);
  }
  }

  return (
    <View>
        <View
        className='border border-white absolute'
        style={{ left: rectDimensions.x, top: rectDimensions.y, width: rectDimensions.width, height: rectDimensions.height }}>
          <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 top-min-9 left-1/2 z-2' {...createHandlePanResponder('top').panHandlers} />
          <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 bottom-min-9 left-1/2 z-2' {...createHandlePanResponder('bottom').panHandlers} />
          <View className='w-long-handle h-long-handle bg-white absolute rounded-11 left-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('left').panHandlers} />
          <View className='w-long-handle h-long-handle bg-white absolute rounded-11 right-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('right').panHandlers} />
          <View className='absolute inset-x-px inset-y-px overflow-hidden'>
            <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
              <ImageComponent image={selectedImage} />
            </ViewShot>
          </View>
          <View>
            <TouchableOpacity onPress={postResponce}>
              <Text>Uncrop</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
};

export default RectangleWithHandles;