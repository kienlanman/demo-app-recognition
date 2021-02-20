import React from 'react';
import FruitImage from '../assets/fruits.png';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, 
    Alert
} from 'react-native'

export default function CategoryListItem(props: any) {
    const { category, onPress } = props;
    return <>
    <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
                <Text style={styles.title}>
                    {category.name}
                </Text>
                <Image source={FruitImage} style={styles.categoryImage}/>
        </View>
    </TouchableOpacity>
    </>
}

const styles = StyleSheet.create({
    categoryImage: {
        width:64, 
        height:64
    },
    container: {
        alignItems: 'center',
        padding:16,
        borderRadius:4,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 0},
        marginBottom: 16
    },
    title: {
        textTransform: 'uppercase',
        marginBottom: 8,
        fontWeight: '700'
    }
});
