import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [photoName, setPhotoName] = useState('');

  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);


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
  
  const storeData = async (photo: any) => {
    try {
      await AsyncStorage.setItem(photoName, photo);
    } catch (e) {
    alert('Failed to save the photo. Please try again.');
    }
  }; 

  const takePicture = async () => {
    console.log("test2")
    if (cameraRef.current && isCameraReady) {
      try{
        const options = {
          quality: 0.8, // You can adjust the quality
          base64: true, // Include base64 encoded image
          skipProcessing: false, // Process the image before returning
        };

        const photo = await cameraRef.current.takePictureAsync(options);
        storeData(photo);

        setPhotoName('');
        alert('Picture taken and saved!');
        router.replace('/addSighting');

      } catch (error) {
        console.error('Error taking picture:', error);
      
      }
    } else {
      alert('Camera is not ready yet.');
    }
  };

  const savePhoto = async () => {
    const existingPhoto = await AsyncStorage.getItem(photoName.trim());
    console.log(existingPhoto);
    if (existingPhoto !== null) {
      alert('A photo with this name already exists. Please choose a different name.');
      return;
    } 
    if(photoName.trim() === ''){
      alert('Please enter a name for the photo.');
      return;
    }
    setPhotoName(photoName.trim());
    setModalVisible(false);
    console.log(photoName);
    takePicture();  
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
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter a name for the photo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Photo name"
              value={photoName}
              onChangeText={setPhotoName}
            />
            <Button title="Save Photo" onPress={savePhoto} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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