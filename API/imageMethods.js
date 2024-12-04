import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Alert, View, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes, deleteObject, uploadBytesResumable } from 'firebase/storage';
import { auth, storage, firestore } from './firbaseConfig';
import { updateDoc, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";




const photoTakeOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    aspect: [4, 3],
    allowsEditing: true
}


/**
 * Returns an image component that can be used to display user profile picture
 * @param {String} uid uid of the user whose image you want to display
 * @param {Map} style input specific desired style settings. input null if default is ok
 * @param {Int} iconSize if using emptyPic icon, specify icon size in display. use 0 for default
 */
export const DisplayImage = (props) => {

    const nullStyle = {
        backgroundColor: '#f2f2f2',
    }

    const defaultStyle = {
        height: 100,
        width: 100,
    }

    const [pic, setPic] = useState(null);

    useEffect(() => {

        const userRef = doc(firestore, 'users', props.uid);

        const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
            if (docSnapshot.exists()){
                if (docSnapshot.data().profilePicture !== undefined){
                    setPic(docSnapshot.data().profilePicture.url);
                }
            }  
        });

        return () => unsubscribe();

    }, []);
    
    return (
        <>
            {pic === null ? <Ionicons name = 'person-circle-outline' size={props.iconSize !== null && props.iconSize !== 0 ? props.iconSize : 50} color='#f2f2f2'/> : 
            <Image style={props.style === null ? defaultStyle : props.style}
            source = {{uri: pic}}/>}
        </>
    );
}



/**
 * This function can be called from anywhere and will take care of the whole image process
 * @param {reference} reference The reference to the doc in firestore where the image url is to be stored
 * @param {string} path The path within that doc that will hold the url and storage reference
 */
export const imageSelect = async (reference, path) => {
    var pic = null;
    Alert.alert(
        "Picture Request",
        "Would you like to take the photo now or use a photo from your library?",
        [
          {
            text: "Take Now",
            onPress: () => takeNow(reference, path),
            style: "cancel",
          },
          { text: "Photo Library", onPress: () => photoLib(reference, path) },
        ]
    );
    //send return to db
}

//function to get live photo from user
const takeNow = async (reference, path) => {
    try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted'){
            //change to alert that status was denied and user has to go to settings to change
            console.log("STATUS FOR CAMERA NOT GRANTED");
            return null;
        }
        const result = await ImagePicker.launchCameraAsync(photoTakeOptions);
        if (result.canceled){
            Alert.alert(
                "Cancelled",
                "The picture taking process has been cancelled",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                    style: "cancel",
                  }
                ]
            );
            return;
        }
        sendToDB(result, reference, path);
    } catch (error) {
        console.log("Image Take Error: " + error);
        return null;
    }
}

//function to get a photo of choice from user photo library
const photoLib = async (reference, path) => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            //change to alert that status was denied and user has to go to settings to change
            console.log("STATUS FOR PHOTO LIBRARY NOT GRANTED");
            return null;
        }
        const result = await ImagePicker.launchImageLibraryAsync();
        if (result.canceled){
            Alert.alert(
                "Cancelled",
                "The picture taking process has been cancelled",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                    style: "cancel",
                  }
                ]
            );
            return;
        }
        sendToDB(result, reference, path);
    } catch (error) {
        console.log("Image Select Error: " + error);
        return null;
    }
}

const sendToDB = async (pic, reference, path) => {
    try{
        const uri = pic.assets[0].uri;

        //create unique reference. sorted first by path and then by unique user ref and then by current timestamp
        const filePath = 'images/' + path + "/" + auth.currentUser.uid + "/" + Date.now() + '.jpg';
        const storageRef = ref(storage, filePath);

        //upload
        const response = await fetch(uri);
        const blob = await response.blob();

        //upload image w storageRef
        /////await uploadBytes(storageRef, blob);
        await uploadBytesResumable(storageRef, blob);

        //get the url for actual user storage
        const downloadURL = await getDownloadURL(storageRef);

        //checks to see if this image is new or is replacing an old image
        checkForExistingImage(reference, path);

        //store the download url. PATH MUST BE CORRECT
        await updateDoc(reference, {[path]: {'url': downloadURL, 'storagePath': filePath}});

        //confirm success
        Alert.alert(
            "Confirmation",
            "Your picture has successfully been uploaded",
            [
              {
                text: "Ok",
                onPress: () => {},
                style: "cancel",
              }
            ]
        );
    } catch (error) {
        console.log("sendToDB error: " + error);
    }
}

//checks the database for the data path in the referenced doc to see if it already holds a picture
//if that field already holds a picture, this will delete that picture from storage and update the field with the path to the new storage picture
//this is important so that the storage part of the database doesn't contain every old, unused picture anyone ever uploads
const checkForExistingImage = async (reference, path) => {
    try {
        const document = await getDoc(reference);
        
        const data = document.data();

        const nestedProp = path.split('.').reduce((obj, key) => obj && obj[key], data);

        //check to see if an image is already present
        if (nestedProp === undefined) {
            return;
        } else {
            deleteImage(nestedProp.storagePath);
        }
        
    } catch (error) {
        console.log("Check for existing Image error: " + error);
    }
}

//deletes the image whose associated storageReference is passed as the parameter
const deleteImage = async (storagePath) => {
    try {
        const storageRef = ref(storage, storagePath);
        deleteObject(storageRef);
    } catch (error) {
        console.log("Delete image error: " + error);
    }
}
