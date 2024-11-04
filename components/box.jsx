import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import config from './config';
import DropDownPicker from 'react-native-dropdown-picker';
import Footer from './Footer'; 


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
  const [latestServices, setLatestServices] = useState([]);
  const [topServices, setTopServices] = useState([]);

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
      setStateItems([{ label: "Select", value: null }, ...statesArray]);
    }
    setStateOpen(true);
  };

  const handleStateSelect = (state) => {
    setStateValue(state);
    setPincodeValue('');
    setCityValue('');
    setStateOpen(false);

    if (!state) {
      setDisplayedServices(allServices.slice(0, 4)); 
      setIsSearchActive(false);
    }
  };

  const filterCities = (input) => {
    setCityValue(input);

    if (input) {
      const filteredCities = allServices
        .filter(service => 
          (!stateValue || service.state === stateValue) &&
          service.city.toLowerCase().includes(input.toLowerCase())
        )
        .map(service => service.city);

      const uniqueCities = Array.from(new Set(filteredCities));
      setCitySuggestions(uniqueCities);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);

      if (!stateValue) {
        setDisplayedServices(allServices.slice(0, 4));
        setIsSearchActive(false);
      }
    }
  };

  const handleCitySelect = (city) => {
    setCityValue(city);
    setShowCitySuggestions(false);
    setPincodeValue('');

    const relatedState = allServices.find(service => service.city === city)?.state;
    
    if (relatedState) {
      setStateValue(relatedState);
    }
  };

  useEffect(() => {
    if (!stateValue && !cityValue && !pincodeValue) {
      setDisplayedServices(allServices.slice(0, 4));
      setIsSearchActive(false); 
    }
  }, [stateValue, cityValue, pincodeValue]);

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
    } else if (stateValue || cityValue) {
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
    } else {
      filteredServices = allServices.slice(0, 4);
    }
    setDisplayedServices(filteredServices.slice(0, 4));
    setCurrentIndex(0);
    setIsSearchActive(stateValue || cityValue);
  };

  const handleNextService = () => {
    if (!isSearchActive) {
      setDisplayedServices(prevDisplayedServices => {
        const nextIndex = (currentIndex + 1) % allServices.length;
        const newService = allServices[(currentIndex + 4) % allServices.length];
        setCurrentIndex(nextIndex);
        return [...prevDisplayedServices.slice(1), newService];
      });
    }
  };

  const handlePrevService = () => {
    if (!isSearchActive) {
      setDisplayedServices(prevDisplayedServices => {
        const prevIndex = (currentIndex - 1 + allServices.length) % allServices.length;
        const newService = allServices[prevIndex];
        setCurrentIndex(prevIndex);
        return [newService, ...prevDisplayedServices.slice(0, 3)];
      });
    }
  };

  const isPincodeDisabled = Boolean(stateValue || cityValue);

  const fetchLatestServices = async () => {
    try {
      const response = await fetch(config.LATESTSERVICE_API_URL);
      const data = await response.json();
      if (data.latestServices && data.latestServices.length > 0) {
        setLatestServices(data.latestServices);
      } else {
        console.warn("No latest services found in the response.");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch latest services');
      console.error('Error fetching latest services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchLatestServices();
  }, []);

  const fetchTopServices = async () => {
    try {
      const response = await fetch(config.TOPSERVICE_API_URL);
      const data = await response.json();
      setTopServices(data.topServices);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch top services');
      console.error('Error fetching top services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchLatestServices();
    fetchTopServices();
  }, []);
  const handleSeeMore = () => {
    setDisplayedServices(prevDisplayedServices => {
      const currentLength = prevDisplayedServices.length;
      const nextItems = allServices.slice(currentLength, currentLength + 4);
      return [...prevDisplayedServices, ...nextItems];
    });
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
              filterDirection="TOP"
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
        <Text style={styles.latestServicesTitle}>Latest Services</Text>
        <View style={styles.latestServicesContainer}>
  {latestServices.length > 0 ? (
    latestServices.map((service, index) => (
      <View key={index} style={styles.latestServiceCard}>
        <View style={styles.latestServiceHeader}>
          <Image source={{ uri: service.iconUrl }} style={styles.latestServiceIcon} />
          <Text style={styles.latestServiceTitle}>{service.title}</Text>
          {service.badge && <Text style={styles.hotBadge}>{service.badge}</Text>}
        </View>
        <Text style={styles.latestServicePrice}>{`₹${service.salaryRange.minimum} - ₹${service.salaryRange.maximum}`}</Text>

        <View style={styles.districtContainer}>
          <Image source={{ uri: service.location.districtIconUrl }} style={styles.districtIcon} />
          <Text style={styles.latestServiceLocation}>{service.location.district}</Text>
        </View>

        <View style={styles.cityContainer}>
          <Image source={{ uri: service.location.iconUrl }} style={styles.cityIcon} />
          <Text style={styles.latestServiceCity}>
            {`${service.location.city}, ${service.location.pincode}`}
          </Text>
        </View>

        <View style={styles.workTypeContainer}>
          <Image source={{ uri: service.workTypeIconUrl }} style={styles.workTypeIcon} />
          <Text style={styles.latestServiceType}>{service.workType}</Text>
        </View>
      </View>
    ))
  ) : (
    <Text>No Latest Services Available</Text>
  )}
</View>

<TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
  <Text style={styles.seeMoreText}>See More</Text>
</TouchableOpacity>
<View style={styles.topServicesContainer}>
<Text style={styles.exploreMoreTitle}>Top <Text style={styles.servicesText}>Services</Text></Text>
  <View style={styles.topServicesRow}>
    {topServices.slice(0, 4).map((service, index) => (
      <View key={index} style={styles.topServiceCard}>
        <Image source={{ uri: service.iconUrl }} style={styles.topServiceIcon} />
        <Text style={styles.topServiceTitle}>{service.title}</Text>
        
        <View style={styles.jobCountLocationContainer}>
          <Text style={styles.topServiceJobs}>{`${service.jobCount} jobs`}</Text>
          <Text style={styles.topServiceLocation}> | {service.location}</Text>
        </View>
      </View>
    ))}
  </View>
</View>
<TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
  <Text style={styles.seeMoreText}>See More</Text>
</TouchableOpacity>
<View style={styles.bannerContainer}>
  <View style={styles.bannerContent}>
    <Text style={styles.bannerTitle}>Build a Vendor Profile</Text>
    <Text style={styles.bannerDescription}>
      With dedication, dedication to duty in mind,{"\n"}
       effort is made to execute responsibilities {"\n"}
       in the best possible way.
    </Text>
    <TouchableOpacity style={styles.bannerButton}>
      <Text style={styles.bannerButtonText}>Create</Text>
    </TouchableOpacity>
  </View>
  <Image source={{ uri: 'https://img.freepik.com/free-photo/day-office-travel-agency_23-2150769946.jpg' }} style={styles.bannerMainImage} />
  <Image source={{ uri: 'https://img.freepik.com/free-photo/day-office-travel-agency_23-2150769946.jpg' }} style={styles.bannerSmallImage} />
</View>
<View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>For Customers – Get Help When You Need It</Text>
      <Text style={styles.sectionSubtitle}>Exercitation dolore reprehenderit fugi</Text>

{/* Card Row */}
<View style={styles.cardContainer}>
  <View style={styles.card}>
    <Image source={{ uri: 'https://media.istockphoto.com/id/1358911296/photo/businesspersons-having-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=UFkexkrxrYYx3Y-_HryVnhraANA5yrM3ieKANzDLr1w=' }} style={styles.cardImage} />
    <Text style={styles.cardCategory}>Do consectetur</Text>
    <Text style={styles.cardTitle}>Register with Ease</Text>
    <View style={styles.cardInfoContainer}>
      <Text style={styles.cardDate}>Dec 22, 2022</Text>
      <Text style={styles.cardReadTime}>  1 min read</Text>
    </View>
  </View>

  <View style={styles.card}>
    <Image source={{ uri: 'https://www.shutterstock.com/image-photo/busy-diverse-professional-business-people-260nw-2346440433.jpg' }} style={styles.cardImage} />
    <Text style={styles.cardCategory}>Consequat labore</Text>
    <Text style={styles.cardTitle}>Manage Your Schedule</Text>
    <View style={styles.cardInfoContainer}>
      <Text style={styles.cardDate}>Dec 22, 2022</Text>
      <Text style={styles.cardReadTime}>  1 min read</Text>
    </View>
  </View>

  <View style={styles.card}>
    <Image source={{ uri: 'https://www.shutterstock.com/image-photo/portrait-enthusiastic-hispanic-young-woman-260nw-2242410029.jpg' }} style={styles.cardImage} />
    <Text style={styles.cardCategory}>Do consectetur</Text>
    <Text style={styles.cardTitle}>Platform Fee</Text>
    <View style={styles.cardInfoContainer}>
      <Text style={styles.cardDate}>Dec 22, 2022</Text>
      <Text style={styles.cardReadTime}>  1 min read</Text>
    </View>
  </View>
</View>


      <TouchableOpacity style={styles.seeMorearticlesButton}>
        <Text style={styles.seeMorearticlesButtonText}>See more articles</Text>
      </TouchableOpacity>
    </View>
      </View>
      <Footer />
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
    top: -95,
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
  latestServicesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#6666ff',
  },
  latestServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: '2%', 
    marginHorizontal: '2%',
    marginTop: 40,
    marginLeft: '190px',
    marginRight: 'auto',
    width: '80%',
  },
  latestServiceCard: {
    width: '26%', 
    backgroundColor: '#f1f1f1', 
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10, 
    marginBottom: 20,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#f5f5f5', 
  },
  latestServiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  latestServiceIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  latestServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  hotBadge: {
    backgroundColor: '#FDEDEC',
    color: '#FF6666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  latestServicePrice: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  latestServiceDistrict: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  latestServiceCity: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  latestServiceWorkType: {
    fontSize: 12,
    color: '#555',
  },
  
  seeMoreButton: {
    marginTop: 20,            
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6666ff',
    borderRadius: 5,
    alignSelf: 'center',       
    alignItems: 'center',
    fontSize:"10px"
  },
  seeMoreText: {
    color: '#fff',              
    fontSize: 14,
  },
  cityContainer: {
    flexDirection: 'row', 
    alignItems: 'center',     
    marginTop: 4,                
  },
  cityIcon: {
    width: 10,                   
    height: 10,                  
    marginRight: 4,  
    fontSize: 1,                 
            
  },
  latestServiceCity: {
    fontSize: 14,                 
    color: '#333',               
  },
  districtContainer: {
    flexDirection: 'row',         
    alignItems: 'center',       
    marginTop: 4,                 
  },
  districtIcon: {
    width: 10,                  
    height: 10,                  
    marginRight: 6,               
  },
  workTypeContainer: {
    flexDirection: 'row',    
    alignItems: 'center',       
    marginTop: 4,        
  },
  workTypeIcon: {
    width: 10,              
    height: 10,                  
    marginRight: 6,               
  },
  topServicesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  topServicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop:'50px'

  },
  topServicesRow: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    marginLeft:"170px",
    marginTop:'50px'

  },
  topServiceCard: {
    width: '20%',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginRight: 6, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f5f5f5', 
    backgroundColor: '#f1f1f1', 

  },
  topServiceIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  topServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  jobCountLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  topServiceJobs: {
    color: '#4A90E2', 
    textDecorationLine: 'underline', 
    fontSize: 14,
    marginRight: 4,
  },
  topServiceLocation: {
    color: '#333',
    fontSize: 14,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6666ff',
    borderRadius: 10,
    padding: 20,
    marginTop: 60,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    width:"850px",
    marginLeft:"190px",
  },
  
  bannerContent: {
    flex: 1,
    backgroundColor: '#6666ff',

  },
  
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:"30px",
    marginTop:"40px"
  },
  
  bannerDescription: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 15,
    marginLeft:"30px"

  },
  
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    width:"80px",
    marginLeft:"30px",
    marginBottom:"30px"
    },
  
  bannerButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    width:"80px",
    marginLeft:"30px"

  },
  
  bannerMainImage: {
    width: 300,
    height: 200,
    borderRadius: 50,
  },
  
  bannerSmallImage: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop:"70px"
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    marginTop:"15px"

  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginLeft:"220px",
    marginTop:"20px"

  },
  card: {
    width: '28%', 
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 1,
    alignItems: 'flex-start',
    marginRight: 18, 
  },
  cardImage: {
    width: '90%', 
    height: 130,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardCategory: {
    fontSize: 12,
    color: '#6666ff',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom:"10px"

  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardReadTime: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',  
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 60, 
    color: '#333', 
 
  },
  seeMorearticlesButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6666ff',
    borderRadius: 5,
    alignSelf: 'center',
  },
  seeMorearticlesButtonText: {
    color: '#fff',
  },
});
