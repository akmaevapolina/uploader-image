import React, { useState, useEffect } from 'react';
import { Image, View, PanResponder } from 'react-native';
import { useSpring, animated } from 'react-spring';
import { useDrag, usePinch} from 'react-use-gesture';

const ImageComponent = ({image}) => {
  
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      setImageSize({ width, height });
    })
  }, [image]);

  const [scale, setScale] = useState(0.7);

  const imgPos = useSpring({ x: 0, y: 0, scale: 1 });

  const bindImgPos = useDrag((params) => {
    imgPos.x.set(params.offset[1]);
    imgPos.y.set(params.offset[0]);
  })

  const bindImgScale = usePinch(({ offset: [d, a] }) => {
    imgPos.scale.set(a);
  });

  const panResponderTopHandlers = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (event, gestureState) => {
      const { dx, dy } = gestureState;
      const newScale = Math.max(0.1, scale - dy / 100); 

      setScale(newScale);
    },
  });

  const panResponderBottomHandlers = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (event, gestureState) => {
      const { dx, dy } = gestureState;
      const newScale = Math.max(0.1, scale + dy / 100);

      setScale(newScale);
    },
  });
  
return(
  <View className='flex-1 items-center justify-center'>
    <animated.div {...bindImgPos()} {...bindImgScale()} 
      style={{
        y: imgPos.x,
        x: imgPos.y,
      }}>
      <View>
        <Image source={{ uri: image }} style={{ width: imageSize.width * scale, height: imageSize.height * scale }}  />
        <View className='absolute w-handle h-handle bg-white rounded-3 top-5px left-5px' {...panResponderTopHandlers.panHandlers} />
        <View className='absolute w-handle h-handle bg-white rounded-3 top-5px right-5px' {...panResponderTopHandlers.panHandlers} />
        <View className='absolute w-handle h-handle bg-white rounded-3 bottom-5px left-5px' {...panResponderBottomHandlers.panHandlers} />
        <View className='absolute w-handle h-handle bg-white rounded-3 bottom-5px right-5px' {...panResponderBottomHandlers.panHandlers} />
      </View>
    </animated.div>
  </View>
  )
};

export default ImageComponent;
