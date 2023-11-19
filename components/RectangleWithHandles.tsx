import React, { useState, useEffect } from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import ImageComponent from './ImageComponent';

const RectangleWithHandles = ({ widthValue, heightValue, onDimensionsChange, selectedImage  }) => {
  const [rectDimensions, setRectDimensions] = useState({
    width: 906,
    height: 585,
    x: 0,
    y: 0,
  });

  const maxWidth = 906; 
  const maxHeight = 585; 

  useEffect(() => {
    const newWidth = parseInt(widthValue, 10) || 0;
    const newHeight = parseInt(heightValue, 10) || 0;
    setRectDimensions((prevDimensions) => ({
      ...prevDimensions,
      width: Math.min(newWidth, maxWidth),
      height: Math.min(newHeight, maxHeight),
    }));
  }, [widthValue, heightValue]);

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

  return (
    <View className='flex-1 p-0.5'>
      <View
        className='border border-white absolute'
        style={{ left: rectDimensions.x, top: rectDimensions.y, width: rectDimensions.width, height: rectDimensions.height }}>
        <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 top-min-9 left-1/2 z-2' {...createHandlePanResponder('top').panHandlers} />
        <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 bottom-min-9 left-1/2 z-2' {...createHandlePanResponder('bottom').panHandlers} />
        <View className='w-long-handle h-long-handle bg-white absolute rounded-11 left-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('left').panHandlers} />
        <View className='w-long-handle h-long-handle bg-white absolute rounded-11 right-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('right').panHandlers} />
        <View className='absolute inset-x-px inset-y-px overflow-hidden'>
          <ImageComponent image={selectedImage} />
        </View>
      </View>
    </View>
  );
};

export default RectangleWithHandles;