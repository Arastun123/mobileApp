import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    const filteredData = data.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    setSearchQuery(text);
    setData(filteredData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Axtarış..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

    alignItems: 'flex-end'
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: 150,
  }
});

export default SearchScreen;
