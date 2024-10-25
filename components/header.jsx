import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native'
import React from 'react'

export default function Header() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.logoText}>LOGO</Text>
        
        {/* Wrap the five items in another View to apply right-side spacing */}
        <View style={styles.menuContainer}>
          <Text style={styles.textWithGap}>Home</Text>
          <Text style={styles.textWithGap}>All services</Text>
          <Text style={styles.textWithGap}>About</Text>
          <Text style={styles.textWithGap}>Contact</Text>
          <Text style={styles.textWithGap}>Login/Register</Text>
          <TouchableOpacity style={styles.vendorButton}>
            <Text style={styles.vendorButtonText}>Join As Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
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
    marginTop:"8px"  
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
    marginLeft:'530px'
  },
  vendorButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
