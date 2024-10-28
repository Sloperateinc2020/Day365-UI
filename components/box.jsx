import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import config from './config';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Box() {
  const [allServices, setAllServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState('');
  const [pincodeValue, setPincodeValue] = useState('');
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await fetch(config.SERVICE_API_URL);
      const data = await response.json();
      setAllServices(data.services);
      setDisplayedServices(data.services.slice(0, 4));
      setIsSearchActive(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch services');
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleStateOpen = () => {
    if (!stateItems.length) {
      const statesSet = new Set(allServices.map(service => service.state));
      const statesArray = Array.from(statesSet).map(state => ({ label: state, value: state }));
      setStateItems(statesArray);
    }
    setStateOpen(true);
  };

  const handleStateSelect = (state) => {
    setStateValue(state);
    setPincodeValue(''); // Clear pincode when state is selected
    setCityValue(''); // Clear city value when state is selected
    setStateOpen(false); // Close the dropdown when a state is selected
  };

  const filterCities = (input) => {
    setCityValue(input);
    if (input && stateValue) {
      const filteredCities = allServices
        .filter(
          service =>
            service.state === stateValue &&
            service.city.toLowerCase().includes(input.toLowerCase())
        )
        .map(service => service.city);
      const uniqueCities = Array.from(new Set(filteredCities));
      setCitySuggestions(uniqueCities);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    setCityValue(city);
    setShowCitySuggestions(false);
    setPincodeValue(''); // Clear pincode when city is selected
  };

  const filterPincodes = (input) => {
    setPincodeValue(input);
    if (input) {
      const filteredPincodes = allServices
        .filter(service => service.pincode.toString().includes(input))
        .map(service => service.pincode);
      const uniquePincodes = Array.from(new Set(filteredPincodes));
      setPincodeSuggestions(uniquePincodes);
      setShowPincodeSuggestions(true);
    } else {
      setShowPincodeSuggestions(false);
    }
  };

  const handlePincodeSelect = (pincode) => {
    setPincodeValue(pincode);
    setShowPincodeSuggestions(false);
    setStateValue(null);
    setCityValue('');
  };

  const handleSearch = () => {
    let filteredServices;

    if (pincodeValue) {
      filteredServices = allServices.filter(service => service.pincode.toString() === pincodeValue.toString());
    } else {
      const validCityInState = allServices.some(
        service => service.state === stateValue && service.city.toLowerCase() === cityValue.toLowerCase()
      );

      if (!validCityInState) {
        Alert.alert('Error', 'The selected city does not belong to the selected state.');
        return;
      }

      filteredServices = allServices.filter(service => {
        const matchesState = stateValue ? service.state === stateValue : true;
        const matchesCity = cityValue ? service.city.toLowerCase() === cityValue.toLowerCase() : true;
        return matchesState && matchesCity;
      });
    }

    setDisplayedServices(filteredServices.slice(0, 4));
    setCurrentIndex(0);
    setIsSearchActive(true);
  };

  const handleNextService = () => {
    if (!isSearchActive && currentIndex < allServices.length - 4) {
      setCurrentIndex(currentIndex + 4);
      setDisplayedServices(allServices.slice(currentIndex + 4, currentIndex + 8));
    }
  };

  const handlePrevService = () => {
    if (!isSearchActive && currentIndex > 0) {
      setCurrentIndex(currentIndex - 4);
      setDisplayedServices(allServices.slice(currentIndex - 4, currentIndex));
    }
  };

  const isPincodeDisabled = Boolean(stateValue || cityValue); // Disable pincode based on state or city selection

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
          <TextInput style={[styles.searchInput, styles.noBorder]} placeholder="Search for Services" />

          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={stateOpen}
              value={stateValue}
              items={stateItems}
              setOpen={setStateOpen}
              setValue={handleStateSelect}
              placeholder="Select State"
              onOpen={handleStateOpen}
              style={[styles.stateInput, styles.noBorder, pincodeValue && styles.disabledField]}
              dropDownContainerStyle={styles.dropdownContainer}
              disabled={!!pincodeValue}
              dropDownDirection="TOP"
            />
          </View>

          <View style={styles.cityInputContainer}>
            <TextInput
              style={[styles.cityInput, styles.noBorder, pincodeValue && styles.disabledField]}
              placeholder="Enter City"
              value={cityValue}
              onChangeText={filterCities}
              editable={!pincodeValue}
            />
            {showCitySuggestions && (
              <FlatList
                data={citySuggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCitySelect(item)}>
                    <Text style={styles.citySuggestionItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.citySuggestionsContainer}
              />
            )}
          </View>

          <View style={styles.pincodeInputContainer}>
            <TextInput
              style={[styles.pincodeInput, isPincodeDisabled && styles.disabledField]}
              placeholder="Pincode"
              value={pincodeValue}
              onChangeText={filterPincodes}
              editable={!isPincodeDisabled}
            />
            {showPincodeSuggestions && (
              <FlatList
                data={pincodeSuggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handlePincodeSelect(item)}>
                    <Text style={styles.pincodeSuggestionItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.pincodeSuggestionsContainer}
              />
            )}
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#FFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceCategories}>
          <TouchableOpacity onPress={handlePrevService} style={[styles.arrowIcon, isSearchActive && styles.disabledArrow]}>
            <Ionicons name="chevron-back" size={24} color={isSearchActive ? "#cccccc" : "#4A90E2"} />
          </TouchableOpacity>

          {displayedServices.map((service, index) => (
            <View key={index} style={[styles.categoryCard, { backgroundColor: service.color }]}>
              <Image
                source={{ uri: service.imageUrl }}
                style={styles.serviceImage}
              />
              <Text style={styles.categoryText}>{service.service}</Text>
              <Text style={styles.availableText}>{service.availableServices}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={handleNextService} style={[styles.arrowIcon, isSearchActive && styles.disabledArrow]}>
            <Ionicons name="chevron-forward" size={24} color={isSearchActive ? "#cccccc" : "#4A90E2"} />
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
    height: "50px"
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
    width: 150,
    marginRight: 10,
  },
  disabledField: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  cityInputContainer: {
    width: 150,
    position: 'relative',
  },
  cityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  citySuggestionsContainer: {
    position: 'absolute',
    top: 45,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 150,
  },
  citySuggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pincodeInputContainer: {
    width: 100,
    position: 'relative',
  },
  pincodeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginRight: 10,
  },
  pincodeSuggestionsContainer: {
    position: 'absolute',
    top: 45,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 150,
  },
  pincodeSuggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 40,
    width: '150%',
    marginLeft: "230px",
  },
  categoryCard: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 160,
    marginHorizontal: 8,
    marginBottom: 16,
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
  disabledArrow: {
    opacity: 0.5,
  },
  noBorder: {
    borderWidth: 0,
  },
});
