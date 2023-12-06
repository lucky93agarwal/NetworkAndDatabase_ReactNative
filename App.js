/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { Linking, AppState } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



// Open a database
const db = SQLite.openDatabase({ name: 'test.db', createFromLocation: 1 });
function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const result = await response.json();

      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Create table if not exists
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
      );
    });

    // Fetch data from the database
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM items;', [], (_, { rows }) => {
        setItems(rows.raw());
      });
    });
    //  fetchData();


  }, []);

  const addItem = () => {
    // Insert a new item into the database
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO items (name) VALUES (?);', ['New Item']);
    });

    // Fetch data again to update the state
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM items;', [], (_, { rows }) => {
        setItems(rows.raw());
      });
    });
  };


  const isDarkMode = useColorScheme() === 'dark';
  const [numericInput, setNumericInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const handleNumericInputChange = (inputValue) => {
    // Remove non-numeric characters using a regular expression
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    // Limit the input to 10 digits
    const trimmedValue = numericValue.slice(0, 10);
    if (trimmedValue.length < 10) {
      setMobileError("Please Enter Valid Mobile No");
    } else {
      setMobileError("");
    }
    setNumericInput(trimmedValue);
  };

  const handleEmailInputChange = (inputValue) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(inputValue) === false) {
      setEmailError("Wrong Email");
    }
    else {
      setEmailError("");
    }
    setEmailInput(inputValue);
  }
  const handleUserNameInputChange = (inputValue) => {
    setUserNameInput(inputValue);
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  function handleTextChange(mobile, email, userName) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (mobile.length < 10) {
      return false;
    } else if (email.length == 0) {
      return false;
    } else if (reg.test(email) === false) {
      return false;
    } else if (userName.length == 0) {
      return false;
    }
    console.log("your mobile no = " + mobile + ", email = " + email + ", user name = " + userName);
    return true;

  }


  const handlePress = () => {
    // Perform asynchronous operation
    someAsyncOperation()
      .then(result => {////
        // Handle the result
        console.log("someAsyncOperation result got = yourapp://somepath?package=com.unittesting = " + result);

        // Open a link when TouchableOpacity is pressed
        Linking.openURL('yourapp://somepath?package=com.unittesting')

          .catch(err => console.error('Error opening URL:', err));
      })
      .catch(error => {
        // Handle errors
        console.error("someAsyncOperation error got = " + error);
      });
  };

  const someAsyncOperation = () => {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., API call, data fetching)
      setTimeout(() => {
        // Resolve the promise with the result
        resolve('Async operation completed lucky');
        // Or reject with an error
        // reject(new Error('Async operation failed'));
      }, 1000);
    });
  };
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: 50, backgroundColor: "#f5f5f5" }}>
        <TextInput
          style={{ fontSize: 16, width: "100%", paddingLeft: 20, borderRadius: 5, borderBottomWidth: 2, borderColor: mobileError == "" ? "#c6c6c6" : "#ff0000" }}
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='Mobile no.'
          keyboardType="numeric"
          value={numericInput}
          onChangeText={handleNumericInputChange}
        ></TextInput>
      </View>
      <Text style={{ color: "#FF0000", fontSize: 11 }}>{mobileError}</Text>

      <View style={{ width: "100%", height: 50, backgroundColor: "#f5f5f5" }}>
        <TextInput
          style={{ fontSize: 16, width: "100%", paddingLeft: 20, borderRadius: 5, borderBottomWidth: 2, borderColor: emailError == "" ? "#c6c6c6" : "#ff0000" }}
          autoCapitalize='none'
          autoCorrect={false}
          value={emailInput}
          placeholder='Email'
          onChangeText={handleEmailInputChange}
        ></TextInput>
      </View>
      <Text style={{ color: "#FF0000", fontSize: 11 }}>{emailError}</Text>
      <View style={{ width: "100%", height: 50, marginVertical: 10, backgroundColor: "#f5f5f5" }}>
        <TextInput
          style={{ fontSize: 16, width: "100%", paddingLeft: 20, borderRadius: 5, borderBottomWidth: 2, borderColor: "#c6c6c6" }}
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='Full Name'
          value={userNameInput}
          onChangeText={handleUserNameInputChange}
        ></TextInput>
      </View>

      <TouchableOpacity onPress={() => {
        Linking.openURL('yourapp://somepath?param1=value1&param2=value2')
          .catch(error => {
            console.error('Error opening deep link:', error.message);
          });
      }}
        style={{
          width: "100%",
          height: 40,
          marginVertical: 20,
          backgroundColor: "#dadada",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text style={{
          color: "#737373",
          fontWeight: "400",
          fontSize: 15
        }}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchData}
        style={{
          width: "100%",
          height: 40,
          marginVertical: 20,
          backgroundColor: "#dadada",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text style={{
          color: "#737373",
          fontWeight: "400",
          fontSize: 15
        }}>Refresh Data</Text>
      </TouchableOpacity>

      <Text>Fetch Data From Server: {JSON.stringify(data)}</Text>


      <TouchableOpacity onPress={addItem}
        style={{
          width: "100%",
          height: 40,
          marginVertical: 20,
          backgroundColor: "#dadada",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text style={{
          color: "#737373",
          fontWeight: "400",
          fontSize: 15
        }}>Add Item In Local Database: </Text>
      </TouchableOpacity>

      <Text>Local Database Items:</Text>
      {items.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
