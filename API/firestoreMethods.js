import {firestore} from './firbaseConfig';
import { setDoc, doc, addDoc, getDoc, collection } from 'firebase/firestore';

// Purpose: Adds a document to firebase with a specified key
// Params: 
// inputCollection (IN, string) - refers to collection being added to
// inputDoc (IN, any) - document key in the collection
// inputData (IN, map) - data fields and values in the new document 
export const sendDataToFirebase = async (inputCollection, inputDoc, inputData) => {
  await setDoc(doc(firestore, inputCollection, `${inputDoc}`), inputData)
}

// Purpose: Adds a document to firebase with a randomly generated key
// Params: 
// inputCollection (IN, string) - refers to collection being added to
// inputData (IN, map) - data fields and values in the new document 
export const addDataToFirebase = async (inputCollection, inputData) => {
  await addDoc(collection(firestore, inputCollection), inputData)
}

// Purpose: Gets data from a document in firebase
// Params: 
// inputCollection (IN, string) - refers to collection being added to
// inputDoc (IN, any) - document key in the collection
// Returns document data if document exists, else returns null
export const getDataFromFirebase = async (inputCollection, inputDoc) => {

  const docRef = doc(firestore, inputCollection, `${inputDoc}`);

  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
  
}
