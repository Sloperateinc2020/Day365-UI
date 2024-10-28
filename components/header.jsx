// Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({ selectedMenu, setSelectedMenu }) {
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.logoText}>LOGO</Text>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => handleMenuClick('Home')}>
            <Text style={[styles.textWithGap, selectedMenu === 'Home' && styles.selectedText]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuClick('All Services')}>
            <Text style={[styles.textWithGap, selectedMenu === 'All Services' && styles.selectedText]}>
              All services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuClick('About')}>
            <Text style={styles.textWithGap}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuClick('Contact')}>
            <Text style={styles.textWithGap}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuClick('Login/Register')}>
            <Text style={styles.textWithGap}>Login/Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vendorButton}>
            <Text style={styles.vendorButtonText}>Join As Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    height: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
    marginLeft: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    marginLeft: 65,
  },
  textWithGap: {
    marginRight: 20,
    fontSize: 16,
    marginTop:"10px"
  },
  selectedText: {
    color: 'blue', // Highlight selected text in blue
  },
  vendorButton: {
    backgroundColor: '#8a6ded',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: '500px',
  },
  vendorButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
