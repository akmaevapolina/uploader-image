import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native';
import CrossIcon from './CrossIcon';
import Svg, { Path } from "react-native-svg"

const UncropInputs = ({ onPressButton, onSizeChange, width, height, onSelectItem }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Custom');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [widthValue, setWidthValue] = useState(width || '906');
    const [heightValue, setHeightValue] = useState(height || '585');

    useEffect(() => {
        if (typeof onSizeChange === 'function' && typeof onSelectItem === 'function') {
            onSizeChange(widthValue, heightValue);
            onSelectItem(selectedItem)
        }
    }, [widthValue, heightValue, selectedItem])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsOpen(false);

        switch (item) {
            case 'Portait':
                setWidthValue('240');
                setHeightValue('580');
                break;
            case 'Landscape':
                setWidthValue('580');
                setHeightValue('240');
                break;
            case 'Square':
                setWidthValue('580');
                setHeightValue('580');
                break;
            case 'Custom':
                setWidthValue('906');
                setHeightValue('585')
                break;
        }
    };

    const handleHoverIn = (item) => {
      setHoveredItem(item);
    };

    const handleHoverOut = () => {
      setHoveredItem(null);
    };

    const handleWidthChange = (value) => {
      setWidthValue(value);
      updateSelectedItem(value, height);
    };

    const handleHeightChange = (value) => {
      setHeightValue(value);
      updateSelectedItem(width, value);
    };

    const updateSelectedItem = (width, height) => {
      if (width === '576' && height === '1024') {
        setSelectedItem('Portait');
      } else if (width === '1024' && height === '576') {
        setSelectedItem('Landscape');
      } else if (width === '1024' && height === '1024') {
      setSelectedItem('Square');
      } else {
      setSelectedItem('Custom');
      }
    };

    const items = ['Custom', 'Portait', 'Landscape', 'Square'];


    return(
        <View className='flex-1 justify-center items-center'>
            <View className='w-562 h-71 rounded-22 bg-gray'>
                <View className='flex-1 flex-row items-center justify-center px-3'>

                    <View>
                        <TouchableOpacity onPress={toggleDropdown} className='flex-row items-center justify-center p-2.5 w-132 h-48 rounded-2xl border border-violet'>
                            {isOpen ? null : <Text className='mr-2.5 font-semibold text-18' style={styles.fontFamilyArchivo}>{selectedItem || items[0]}</Text>}
                            {isOpen ? null : <Svg width={12} height={12} viewBox='0 0 16 16'>
                                                <Path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" strokeWidth={2} stroke={"#7C878E"}/>
                                            </Svg> }
                            {isOpen && (
                                <View className='mt-126 rounded-2xl w-134 h-176 pt-2 bg-white-gray'>
                                    {items.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => handleSelectItem(item)}
                                        onPressIn={() => handleHoverIn(item)}
                                        onPressOut={handleHoverOut}
                                        style={[styles.itemContainer, selectedItem === item && styles.selectedItemContainer]}>
                                        <Text style={[styles.itemText, selectedItem === item && styles.selectedItemText]}>{item}</Text>
                                    </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className='flex-1 flex-row justify-center items-center'>
                        <View className='justify-center w-107 h-48 rounded-2xl border border-violet bg-black-gray'>
                            <TextInput
                                keyboardType='numeric' style={styles.fontFamilyArchivo} className='font-normal text-18 w-20 ml-15 outline-0'
                                value={width}
                                onChangeText={handleWidthChange}/>
                        </View>

                        <View className='px-3'>
                        <CrossIcon size='12px' thickness='2px' color='black'/>
                    </View>

                    <View className='justify-center w-107 h-48 rounded-2xl border border-violet bg-black-gray'>
                        <TextInput keyboardType='numeric' style={styles.fontFamilyArchivo} className='font-normal text-18 w-20 ml-15 outline-0' value={height} onChangeText={handleHeightChange} />
                    </View>
                </View>

                <View className='w-107 h-48 rounded-40 justify-center bg-orange'>
                    <TouchableOpacity onPress={onPressButton}>
                        <Text style={styles.fontFamilyInter} className='font-black text-15 text-white text-center'>Uncrop</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
    )
};

const styles = StyleSheet.create({

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

export default UncropInputs;
