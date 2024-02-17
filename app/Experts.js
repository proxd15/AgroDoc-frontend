import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import Experts from '../ExpertDetails/ExpertsDetails';
import { ScrollView } from 'react-native-gesture-handler';

const BotanistCard = () => {
  const onRequestPress = ()=>{

  };
  return (
      <ScrollView>
    <View>
      {Experts.map(expert => (
        <View key={expert.id} style={styles.cardContainer}>
          <Image source={{ uri: expert.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{expert.name}</Text>
            <Text style={styles.exprience}>Experience: {expert.exprience}</Text>
            <Text style={styles.charges}>Charges per session: {expert.charges}</Text>
          </View>
          <Button title="Request Session" onPress={onRequestPress} />
        </View>
      ))}
    </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5, // Shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exprience: {
    fontSize: 18,
    fontWeight: 'bolder',
    marginBottom: 5,
  },
  charges: {
    fontSize: 16,
  },
});

export default BotanistCard;
