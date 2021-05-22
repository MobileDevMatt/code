import React from 'react';
import { Modal, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {Button, CustomizableButton} from 'theme/Button';
import { palette } from '../../shared/src/cosmos';

export default function ImgPicker({showImagePicker, setShowImagePicker, setImageData}: {showImagePicker: boolean, setShowImagePicker: React.Dispatch<React.SetStateAction<boolean>>, setImageData: React.Dispatch<React.SetStateAction<string>>}) {

  const launchCameraOrMedia = async (isCameraPermission: boolean) => {

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    }

    let result = isCameraPermission ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.cancelled && result.base64) {
      const data = result.base64;
      setImageData(() => data);
      onCancelPressed();
    }
  }

  const checkForPermission = async (isCameraPermission: boolean) => {
    const permission = (isCameraPermission) ? await ImagePicker.getCameraPermissionsAsync() : await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permission.granted) {
      launchCameraOrMedia(isCameraPermission);
    } else if (permission.canAskAgain) {
      const { status } = (isCameraPermission) ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        launchCameraOrMedia(isCameraPermission);
      }
    } else {
      if (isCameraPermission) {
        alert('Sorry, we need camera permissions to make this work! Please grant permission from app settings');
      } else {
        alert('Sorry, we need media library storage permissions to make this work! Please grant permission from app settings');
      }
    }
  };

  const onCancelPressed = () => {
    setShowImagePicker(() => false);
  };

  return (
    <View style={{flex: 1}}>
      <Modal
        transparent={true}
        visible={showImagePicker}
        animationType="slide"
        onRequestClose={() => {
         
        }}
      >
        <View style={{backgroundColor: '#000000bf', flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{width: '100%'}}> 
          <CustomizableButton
            title={'Photo Library'}
            onPress={() => checkForPermission(false)}
            style={{marginHorizontal: 16, marginBottom: 8}}
          />
          <CustomizableButton
            title={'Take Photo'}
            onPress={() => checkForPermission(true)}
            style={{marginHorizontal: 16, marginBottom: 16}}
          />
          <CustomizableButton
            title={'Cancel'}
            onPress={onCancelPressed}
            style={{marginHorizontal: 16, marginBottom: 32, backgroundColor: palette.auxillary.crimson.main}}
          />
          </View>
        </View>
      </Modal>
    </View>
  );
}
