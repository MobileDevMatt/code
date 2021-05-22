import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';


export function userAndroidCameraAudioPermissions() {
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        // Request required permissions from Android
        await requestCameraAndAudioPermission();
      }
    })();
  }, []);

  const requestCameraAndAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the mic');
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

}
