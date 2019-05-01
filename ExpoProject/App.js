import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import * as firebase from 'firebase';
import 'firebase/firestore';

export default class App extends React.Component {

  constructor(props)
  {
    super(props);

    var config = {
      //expo allows for secrets and keys access: https://docs.expo.io/versions/latest/workflow/configuration/
      apiKey: "AIzaSyBE9NNYz5W31zoxsApHeoW4Lcl1QZrGJ_g",
      authDomain: "edsigconproject.firebaseapp.com",
      databaseURL: "https://edsigconproject.firebaseio.com",
      projectId: "edsigconproject",
      storageBucket: "edsigconproject.appspot.com",
      messagingSenderId: "103618757267"
    };

    //ensure that no more than one firebase is instantiated
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    this.state = {
      speakers: [],
      db: firebase.firestore()
    }

    this.HandleDatabaseRead = this.HandleDatabaseRead.bind(this);
    this.GetAllSpeakers = this.GetAllSpeakers.bind(this);

  }

  GetAllSpeakers(){

    let speakersRef = this.state.db.collection("speakers");

    speakersRef.get()
             .then( (querySnapshot) => {
               if(!querySnapshot.empty){
                this.HandleDatabaseRead(querySnapshot);
               }
             })
             .catch((error) => 
             {
                console.log(error);
             });
  }

  //callback for firebase to call
  HandleDatabaseRead(data){

    //console.log("FIRESTORE_TEST", data);

    const ords = [];

    data.forEach( (doc) => {

      //destructure data
      const { item } = doc.data();

      let listItem = {
        key: doc.id,
        Name: item,
        Description: item

      }

      ords.push(listItem);
    });

    console.log(ords);
    this.setState(
      {
        speakers: ords
      }
    )
  }  

  componentDidMount()
  {
    this.GetAllSpeakers();
  }  

  render() {
    return (
      <View style={styles.container}>
        <Text>Speakers</Text>
        <FlatList data={this.state.speakers}
                  renderItem={({Description}) => <Text style={styles.item}>{Description.item}</Text>} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100    
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },  
});