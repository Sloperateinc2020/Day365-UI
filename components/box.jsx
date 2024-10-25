import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import config from './config';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Box() {
  const [services, setServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchServices = async () => {
    try {
      const response = await fetch(config.SERVICE_API_URL);
      const data = await response.json();
      setServices(data.services);

      // Set initial displayed services
      setDisplayedServices(data.services.slice(0, 4)); // Show only the first 4 services
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch services');
      console.error('Error fetching services:', error);
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const handleStateOpen = () => {
    // Fetch unique states when the dropdown opens
    if (!stateItems.length) { // Only fetch if state items are not already loaded
      const statesSet = new Set(services.map(service => service.state));
      const statesArray = Array.from(statesSet).map(state => ({ label: state, value: state }));
      setStateItems(statesArray);
    }
    setStateOpen(true);
  };

  const handleCityOpen = () => {
    // Fetch cities based on selected state when city dropdown opens
    if (stateValue) {
      const filteredCities = services
        .filter(service => service.state === stateValue)
        .map(service => ({ label: service.city, value: service.city }));

      // Ensure unique cities
      const uniqueCities = Array.from(new Set(filteredCities.map(city => city.label)))
        .map(city => ({ label: city, value: city }));

      setCityItems(uniqueCities);
    }
    setCityOpen(true);
  };

  // Update cities based on selected state
  useEffect(() => {
    if (stateValue) {
      handleCityOpen(); // Automatically open city dropdown when state changes
    } else {
      setCityItems([]); // Clear cities if no state is selected
    }
    setCityValue(null); // Reset city selection when state changes
  }, [stateValue]);

  const handleNextService = () => {
    if (currentIndex < services.length - 5) {
      setCurrentIndex(currentIndex + 1);
      setDisplayedServices(services.slice(currentIndex + 1, currentIndex + 5));
    }
  };

  const handlePrevService = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDisplayedServices(services.slice(currentIndex - 1, currentIndex + 3));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.outerContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>Welcome to <Text style={styles.boldText}>Day</Text> 365</Text>
          <Text style={styles.subtitle}>- Local Services at Your Fingertips!</Text>
          <Text style={styles.welcomeDescription}>
            At <Text style={styles.boldText}>Day 365</Text>, we make it easier than ever to book trusted local services{"\n"}
            online. Whether you need a plumber, electrician, driver, or any other{"\n"}
            professional, we’ve got you covered with a network of experts ready to{"\n"}
            serve you.
          </Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.card}>
            <Text style={styles.serviceTitle}>Plumber</Text>
            <Text style={styles.bookText}>Book with Ease</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.serviceTitle}>Driver</Text>
            <Text style={styles.bookText}>Book at Cheap COST</Text>
          </View>
        </View>
      </View>

      <View style={styles.exploreMoreSection}>
        <Text style={styles.exploreMoreTitle}>Explore more <Text style={styles.servicesText}>Services</Text></Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for Services" />

          {/* State Dropdown */}
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={stateOpen}
              value={stateValue}
              items={stateItems}
              setOpen={setStateOpen}
              setValue={setStateValue}
              placeholder="Select State"
              onOpen={handleStateOpen} // Trigger fetch when opening
              style={styles.stateInput}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* City Dropdown */}
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={cityOpen}
              value={cityValue}
              items={cityItems}
              setOpen={setCityOpen}
              setValue={setCityValue}
              placeholder="Select City"
              onOpen={handleCityOpen} // Trigger fetch when opening
              style={styles.cityInput}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <TextInput style={styles.pincodeInput} placeholder="Pincode" />
          <TouchableOpacity style={styles.searchButton} onPress={fetchServices}>
            <Ionicons name="search" size={20} color="#FFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceCategories}>
          <TouchableOpacity onPress={handlePrevService} style={styles.arrowIcon}>
            <Ionicons name="chevron-back" size={24} color="#4A90E2" />
          </TouchableOpacity>

          {displayedServices.map((service, index) => (
            <View key={index} style={[styles.categoryCard, { backgroundColor: '#F0F0F0' }]}>
              <Image
                source={{ uri: service.imageUrl }}
                style={styles.serviceImage}
              />
              <Text style={styles.categoryText}>{service.service}</Text>
              <Text style={styles.availableText}>{service.availableServices}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={handleNextService} style={styles.arrowIcon}>
            <Ionicons name="chevron-forward" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#D6E4FF',
    borderRadius: 1,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 20,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginLeft: 50,
    marginTop: 40,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
    marginLeft: 220,
  },
  welcomeDescription: {
    fontSize: 12,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
    marginLeft: 50,
  },
  exploreButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginLeft: 50,
    width: 120,
    height: 40,
  },
  exploreButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    width: 150,
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookText: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 5,
  },
  exploreMoreSection: {
    padding: 20,
  },
  exploreMoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  servicesText: {
    color: '#6666ff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    width: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  stateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginRight: 10,
  },
  cityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginRight: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    width: 100,
  },
  dropdownWrapper: {
    width: 100,
    marginLeft: 10,
  },
  pincodeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginRight: 10,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6666ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 5,
  },
  serviceCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%', // Ensure it takes full width
  },
  categoryCard: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
    margin: 3,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  availableText: {
    fontSize: 12,
    color: '#666',
  },
  arrowIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dropdownToggle: {
    backgroundColor: '#D6E4FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  dropdownToggleText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  additionalServices: {
    marginTop: 10,
  },
});
