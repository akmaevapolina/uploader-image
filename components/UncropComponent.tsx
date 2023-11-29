
import React, { useRef, useState, useEffect} from 'react';

import { View, StyleSheet, Image, PanResponder, Dimensions } from 'react-native';
import * as Font from 'expo-font';

import ViewShot from 'react-native-view-shot'

import { useSpring, animated } from 'react-spring';
import { useDrag, usePinch} from 'react-use-gesture';
import UncropInputs from './UncropInputs';

Font.loadAsync({
  'Archivo': require('/assets/fonts/Archivo.ttf'),
  'Inter': require('/assets/fonts/Inter.ttf'),
});

const UncropComponent = ({ selectedImage }) => {
  
  const [selectedItem, setSelectedItem] = useState('Custom');
  const [widthValue, setWidthValue] = useState('906');
  const [heightValue, setHeightValue] = useState('585');
  const [capturedUri, setCupturedUri] = useState(null)

  const handleSizeChange = (newWidth, newHeight) => {
    setWidthValue(String(newWidth));
    setHeightValue(String(newHeight));
  }

  const handleCapture = (capturedUri) => {
    console.log(capturedUri)
    setCupturedUri(capturedUri)
  } 
    
  const rectangleRef = useRef();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

    

  const [rectDimensions, setRectDimensions] = useState({
    width: 906,
    height: 585,
    x: 0,
    y: 0,
  });

  const maxWidth = 906; 
  const maxHeight = 585; 

  const viewShotRef = useRef(null)
  const imageSizeRef = useRef({ width: 0, height: 0 });

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
      setImageSize({ width, height });
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
    if (handleSizeChange) {
      handleSizeChange(newWidth, newHeight);
    }
  };

  const createHandlePanResponder = (handle) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => handlePanResponderMove(_, gestureState, handle),
    });
  };

  // image

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

  const handleSelectItem = (item) => {
    setSelectedItem(item)
  }

  const handleButtonClick = async () => {

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
          x: Math.max(0, rectDimensions.x),
          y: Math.max(0, rectDimensions.y),
          width: Math.min(rectDimensions.width, imageWidth - Math.max(0, rectDimensions.x)),
          height: Math.min(rectDimensions.height, imageHeight - Math.max(0, rectDimensions.y)),
        },
      });

      if (handleCapture) {
        handleCapture(uri);
        setCupturedUri(uri);

        const binaryImage = atob(uri.split(',')[1]);

        const blob = new Blob([new Uint8Array([...binaryImage].map(char => char.charCodeAt(0)))], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('image', blob, 'capturedImage.jpg');

        const responsePic = await fetch('https://eouqhcijqenehm8.m.pipedream.net', {
          method: 'POST',
          body: formData
        });
        console.log('Server response1:', responsePic);

        const responseData = await fetch('https://eouqhcijqenehm8.m.pipedream.net', {
          method: 'POST',
          body: JSON.stringify({
            selectedItem,
            widthValue,
            heightValue
        }),
        });
        console.log('Server response2:', responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
     <View className='flex-1 justify-center items-center'>
        <View className='w-1134 h-816 bg-violet rounded-32 items-center pt-2'>
      <View style={styles.shadow} className='w-1118 h-702 bg-violet rounded-28 py-16 px-28 p-16'>
        <View>
          <View>
            <View className='border border-white absolute' style={{ left: rectDimensions.x, top: rectDimensions.y, width: rectDimensions.width, height: rectDimensions.height }}>

              <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 top-min-9 left-1/2 z-2' {...createHandlePanResponder('top').panHandlers} />
              <View className='w-long-handle h-long-handle bg-white absolute rounded-11 rotate-90 bottom-min-9 left-1/2 z-2' {...createHandlePanResponder('bottom').panHandlers} />
              <View className='w-long-handle h-long-handle bg-white absolute rounded-11 left-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('left').panHandlers} />
              <View className='w-long-handle h-long-handle bg-white absolute rounded-11 right-min-6px top-1/2 z-2 mt-min-35px' {...createHandlePanResponder('right').panHandlers} />

              <View className='absolute inset-x-px inset-y-px overflow-hidden'>
              <View className='flex-1 items-center justify-center' style={{ alignItems: 'center', justifyContent: 'center' }}>

                <animated.div {...bindImgPos()} {...bindImgScale()} style={{ y: imgPos.x, x: imgPos.y }}>
                  <View>
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={{ position: "relative", width: rectDimensions.width * scale, height: rectDimensions.height * scale }} >
                      <Image source={{ uri: selectedImage }} style={{ width: rectDimensions.width * scale, height: rectDimensions.height * scale }}  />
                    </ViewShot>

                    <View className='absolute w-handle h-handle bg-white rounded-3 top-5px left-5px' {...panResponderTopHandlers.panHandlers} />
                    <View className='absolute w-handle h-handle bg-white rounded-3 top-5px right-5px' {...panResponderTopHandlers.panHandlers} />
                    <View className='absolute w-handle h-handle bg-white rounded-3 bottom-5px left-5px' {...panResponderBottomHandlers.panHandlers} />
                    <View className='absolute w-handle h-handle bg-white rounded-3 bottom-5px right-5px' {...panResponderBottomHandlers.panHandlers} />
                  </View>
                </animated.div>

              </View>
            </View>
          </View>
        </View>

        {capturedUri && (
          <View>
            <Image source={{ uri: capturedUri }} style={{ flex: 1 }} />
          </View>
        )}

      </View>
    </View>

    <UncropInputs onPressButton={handleButtonClick}
      onSizeChange={handleSizeChange}
      width={rectDimensions.width}
      height={rectDimensions.height}
      onSelectItem={handleSelectItem} />
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
  },

  itemContainer: {
    width: 112,
    height: 40,
    borderRadius: 12,
    padding: 8
  },

  selectedItemContainer: {
    backgroundColor: 'black',
  },

  itemText: {
    color: "black",
    textAlign: 'center',
    fontWeight: "600",
    fontFamily: "Inter",
    paddingTop: 3
  },

  selectedItemText: {
    color: "#FCFDFE",
    textAlign: 'center',
    fontWeight: "600",
    fontFamily: "Inter",
    paddingTop: 3
  },

  fontFamilyArchivo: {
    fontFamily: "Archivo",
  },

  fontFamilyInter: {
    fontFamily: "Inter",
  },
})

export default UncropComponent;
