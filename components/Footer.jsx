import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.linksSection}>
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <View style={styles.product}>
          <Text style={styles.productTitle}>Product</Text>
          <Text style={styles.productItem}>All Services</Text>
          <Text style={styles.productItem}>Companies</Text>
          <Text style={styles.productItem}>Candidates</Text>
        </View>
        <View style={styles.resources}>
          <Text style={styles.resourcesTitle}>Resources</Text>
          <Text style={styles.resourcesItem}>Blog</Text>
          <Text style={styles.resourcesItem}>User Guides</Text>
          <Text style={styles.resourcesItem}>Webinars</Text>
        </View>
        <View style={styles.compant}>
          <Text style={styles.companyTitle}>Company</Text>
          <Text style={styles.companyItem}>About</Text>
          <Text style={styles.companyItem}>Join Us</Text>
        </View>
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Subscribe to our newsletter</Text>
          <Text style={styles.newsletterSubtitle}>For product announcements and exclusive insights</Text>
          <View style={styles.newsletterInputContainer}>
            <Ionicons name="mail-outline" size={16} color="#999" style={{ marginRight: 5 }} />
            <TextInput placeholder="Input your email" style={styles.newsletterInput} />
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>English</Text>
          <Ionicons name="chevron-down" size={14} color="#fff" />
        </TouchableOpacity>

        <View style={styles.rightBottomSection}>
          <Text style={styles.copyrightText}>© 2024 Brand, Inc. • Privacy • Terms • Sitemap</Text>
          <View style={styles.socialIcons}>
            <FontAwesome name="twitter" size={18} color="#4A90E2" style={styles.iconSpacing} />
            <FontAwesome name="facebook" size={18} color="#4A90E2" style={styles.iconSpacing} />
            <Feather name="linkedin" size={18} color="#4A90E2" style={styles.iconSpacing} />
            <FontAwesome name="youtube-play" size={18} color="#FF0000" style={styles.iconSpacing} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    footerContainer: {
      backgroundColor: '#111',
      padding: 20,
      paddingTop: 50,
      marginTop: 40,
      marginBottom:"0px"
    },
    logoSection: {
      marginBottom: 20,
      marginLeft:"50px"
    },
    logoText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linksSection: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 20,
      marginLeft: 20,
    },
    product: {
      width: 140,
      marginLeft: 130,
    },
    productTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 7,
    },
    productItem: {
      color: '#ccc',
      fontSize: 14,
      marginBottom: 7,
      paddingVertical: 2,
    },
    resources: {
      width: 140,
    },
    resourcesTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 7,
    },
    resourcesItem: {
      color: '#ccc',
      fontSize: 14,
      marginBottom: 7,
      paddingVertical: 2,
    },
    company: {
      width: 140,
    },
    companyTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 7,
    },
    companyItem: {
      color: '#ccc',
      fontSize: 14,
      marginBottom: 7,
      paddingVertical: 2,
    },
    newsletterSection: {
        width: 260,
        marginLeft: 170, 
      },
      
    newsletterTitle: {
      color: '#6666ff',
      fontSize: 16,
    },
    newsletterSubtitle: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 30,
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        width:"800px"
      },
      
    newsletterInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    newsletterInput: {
      flex: 1,
      color: '#fff',
      fontSize: 14,
      padding: 5,
    },
    subscribeButton: {
      backgroundColor: '#6666ff',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 60,
    },
    subscribeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    bottomSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 15,
    },
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      marginLeft: 70,
    },
    languageText: {
      color: '#fff',
      fontSize: 14,
      marginRight: 5,
    },
    rightBottomSection: {
      flexDirection: 'row', 
      alignItems: 'center', 
    },
    copyrightText: {
      color: '#888',
      fontSize: 12,
      marginRight: 420,
    },
    socialIcons: {
      flexDirection: 'row',
      marginRight: 100,
    },
    iconSpacing: {
      marginHorizontal: 5,
    },
  });
  