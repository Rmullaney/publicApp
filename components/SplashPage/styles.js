import { StyleSheet} from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#821019',
      paddingBottom: 20, // Add padding to push the content up from the bottom
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: 'white',
      position: 'absolute', // Position the subtitle absolutely
      bottom: 20, // Position it at the bottom
    },
  });

export default styles;