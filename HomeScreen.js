import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

const HomeScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);

  // Function to fetch images from API
  const fetchImages = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const photoList = data.photos.photo;
      setImages(photoList);
      // Cache the image URLs
      await AsyncStorage.setItem('cachedImages', JSON.stringify(photoList));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Function to fetch cached images from AsyncStorage
  const fetchCachedImages = async () => {
    try {
      const cachedImages = await AsyncStorage.getItem('cachedImages');
      if (cachedImages !== null) {
        setImages(JSON.parse(cachedImages));
      } else {
        fetchImages(); // Fetch images from API if not cached
      }
    } catch (error) {
      console.error('Error fetching cached images:', error);
    }
  };

  useEffect(() => {
    fetchCachedImages(); // Fetch cached images on component mount
  }, []);
  const refreshImages = async () => {
    fetchImages(); // Refresh images
  };
  useEffect(() => {
    const intervalId = setInterval(refreshImages, 5000); // Refresh every 5 seconds

    // Clean up function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.url_s }} style={styles.image} />
    </View>
  );

  return (
    <View>
      <Text
        style={{
          alignSelf: 'center',
          color: 'black',
          fontSize: 20,
          fontWeight: 'bold',
          padding: 20,
        }}>
        Recent Images from Flickr
      </Text>

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / 2,
  },
  image: {
    flex: 1,
    margin: 10,
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: Dimensions.get('window').width / 4,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
