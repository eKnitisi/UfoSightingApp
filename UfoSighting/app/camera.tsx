import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View,Image } from 'react-native';
import { router, useNavigation } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();


  const [photoUri, setPhotoUri] = useState<string | null>(null);


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const savePhotoPermanently = async (photoURI: string) => {
    try {
      if (!mediaPermission) {
        requestMediaPermission();
      }
      const directory = FileSystem.documentDirectory + 'ufo/';
    
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }
      const fileName = `ufo_${Date.now()}.jpg`;
      const newPath = `${directory}${fileName}`;
  
        await FileSystem.copyAsync({
        from: photoURI,
        to: newPath,
      });
      return newPath;
    } catch(e){
      console.log("Foto opslaan mislukt")
      return null;
    }
  }

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try{

        const photo = await cameraRef.current.takePictureAsync();
        if(photo){
          const permanentURI = await savePhotoPermanently(photo.uri);
          setPhotoUri(photo.uri);

          router.push({ pathname: "/addSighting", params: { URI: permanentURI } });

        }
      } catch (error) {
        console.error('Error taking picture:', error);
      
      }
    } else {
      alert('Camera is not ready yet.');
    }
  };

return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} onCameraReady={onCameraReady}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <Text style={styles.button}>
            <Text style={styles.separator}>|</Text>
          </Text>          
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
    zIndex:1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  separator: {
    textAlign: 'center',
    fontSize: 70,
    lineHeight: 60,
    height: 'auto',
    width: 'auto',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});