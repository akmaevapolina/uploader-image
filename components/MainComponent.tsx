import React from 'react';

import { View } from 'react-native';
import WhiteBlockComponent from './WhiteBlockComponent';

const MainComponent = ({selectedImage}) => {

    return (
        <View className='flex-1 justify-center items-center'>
            <WhiteBlockComponent selectedImage={selectedImage}/>
        </View>
    );
};

export default MainComponent;
