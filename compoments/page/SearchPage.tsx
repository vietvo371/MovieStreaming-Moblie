import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

function Profile({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Profile;