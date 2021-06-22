import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native'
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";

export default class ProductListItem extends React.Component<any, any> {

    playBase64Audio = async (fileBase64: string) => {
        // Write the Base64 to a new location
        const options = { encoding: FileSystem.EncodingType.Base64 };
        const testUri = FileSystem.documentDirectory + "demo_sound.mp3";
        await FileSystem.writeAsStringAsync(testUri, fileBase64, options);
        // Enable audio on the device
        await Audio.setIsEnabledAsync(true);
        // Play audio from the new Base64, or from the original reference. <3
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync({ uri: testUri });
            await soundObject.setVolumeAsync(0.7);
            // await soundObject.loadAsync(resource);
            await soundObject.playAsync();
            // Your sound is playing!
        } catch (error) {
            console.log(error);
            // An error occurred!
        }
    }

    render() {
        const { product, deleteVoice } = this.props;
        return <>
            <View style={styles.shadow}>
                <View style={styles.container}>
                    <Image style={styles.img} source={require("../assets/avatar.png")}></Image>
                    <View style={styles.info}>
                        <Text style={styles.name}>{product.name}</Text>
                        <View style={styles.priceRow}>
                            {/* <TouchableOpacity>
                                <Text style={styles.editButton}>Sửa</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={() => deleteVoice(product.objectId)}
                            >
                                <Text style={styles.deleteButton}>Xóa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.playBase64Audio(product.voice)}
                            >
                                <Text style={styles.listenButton}>Nghe</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    }
}

const styles = StyleSheet.create({
    img: {
        height: 150,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4
    },
    container: {
        marginBottom: 20,
        borderRadius: 4,
        backgroundColor: '#FFF',
        overflow: 'hidden'
    },
    editButton: {
        textTransform: 'uppercase',
        fontSize: 16,
        color: '#888',
        paddingRight: 20
    },
    deleteButton: {
        textTransform: 'uppercase',
        fontSize: 16,
        color: '#a52a2a',
        paddingRight: 20
    },
    listenButton: {
        textTransform: 'uppercase',
        fontSize: 16,
        color: '#b8860b'
    },
    shadow: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 }
    },
    info: {
        padding: 8
    },
    name: {
        fontSize: 16,
        marginBottom: 8
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    price: {
        fontSize: 16,
        color: '#888',
        flex: 1
    }
});
