'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    send: 'Send',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // App
    appTitle: 'AgroVentis',
    appSubtitle: 'Connect with Buyers Directly',
    
    // Auth
    login: 'Login',
    register: 'Register',
    phone: 'Phone Number',
    password: 'Password',
    name: 'Full Name',
    email: 'Email (Optional)',
    state: 'State',
    district: 'District',
    village: 'Village',
    pincode: 'Pincode',
    loginBtn: 'Login',
    registerBtn: 'Register',
    
    // Navigation
    marketplace: 'Marketplace',
    myListings: 'My Listings',
    connections: 'Connections',
    profile: 'Profile',
    
    // Marketplace
    filterByCategory: 'Filter by Category',
    allCategories: 'All Categories',
    noListingsFound: 'No listings found',
    
    // Listings
    addListing: 'Add New Listing',
    addListingTitle: 'Add New Listing',
    product: 'Product',
    quantity: 'Quantity',
    price: 'Price',
    quality: 'Quality Description',
    harvestDate: 'Harvest Date',
    location: 'Location',
    submitListing: 'Submit Listing',
    
    // Status
    active: 'Active',
    pending: 'Pending',
    closed: 'Closed',
    available: 'Available',
    sold: 'Sold',
    expired: 'Expired',
    
    // Messages
    message: 'Message',
    sendMessage: 'Send Message',
    typeMessage: 'Type a message...',
    noMessages: 'No messages yet',
    
    // Offline
    offlineMode: 'Offline Mode',
    onlineMode: 'Online Mode',
    syncInProgress: 'Sync in progress...',
    
    // Notifications
    connectionRequest: 'New connection request!',
    messageReceived: 'New message received',
    listingUpdated: 'Listing updated successfully',
    
    // Quality
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    
    // Units
    kg: 'kg',
    quintal: 'quintal',
    ton: 'ton',
    piece: 'piece',
    dozen: 'dozen'
  },
  
  hi: {
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    close: 'बंद करें',
    send: 'भेजें',
    back: 'पीछे',
    next: 'अगला',
    previous: 'पिछला',
    
    // App
    appTitle: '🌾 एग्रोमित्र',
    appSubtitle: 'खरीदारों से सीधे जुड़ें',
    
    // Auth
    login: 'लॉगिन',
    register: 'रजिस्टर',
    phone: 'फोन नंबर',
    password: 'पासवर्ड',
    name: 'पूरा नाम',
    email: 'ईमेल (वैकल्पिक)',
    state: 'राज्य',
    district: 'जिला',
    village: 'गांव',
    pincode: 'पिनकोड',
    loginBtn: 'लॉगिन',
    registerBtn: 'रजिस्टर',
    
    // Navigation
    marketplace: 'बाजार',
    myListings: 'मेरी लिस्टिंग्स',
    connections: 'कनेक्शन्स',
    profile: 'प्रोफाइल',
    
    // Marketplace
    filterByCategory: 'श्रेणी से फ़िल्टर करें',
    allCategories: 'सभी श्रेणियां',
    noListingsFound: 'कोई लिस्टिंग नहीं मिली',
    
    // Listings
    addListing: 'नई लिस्टिंग जोड़ें',
    addListingTitle: 'नई लिस्टिंग जोड़ें',
    product: 'उत्पाद',
    quantity: 'मात्रा',
    price: 'मूल्य',
    quality: 'गुणवत्ता विवरण',
    harvestDate: 'फसल तिथि',
    location: 'स्थान',
    submitListing: 'लिस्टिंग जमा करें',
    
    // Status
    active: 'सक्रिय',
    pending: 'लंबित',
    closed: 'बंद',
    available: 'उपलब्ध',
    sold: 'बिक गया',
    expired: 'समाप्त',
    
    // Messages
    message: 'संदेश',
    sendMessage: 'संदेश भेजें',
    typeMessage: 'एक संदेश टाइप करें...',
    noMessages: 'अभी तक कोई संदेश नहीं',
    
    // Offline
    offlineMode: 'ऑफलाइन मोड',
    onlineMode: 'ऑनलाइन मोड',
    syncInProgress: 'सिंक हो रहा है...',
    
    // Notifications
    connectionRequest: 'नया कनेक्शन अनुरोध!',
    messageReceived: 'नया संदेश प्राप्त हुआ',
    listingUpdated: 'लिस्टिंग सफलतापूर्वक अपडेट की गई',
    
    // Quality
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    average: 'औसत',
    
    // Units
    kg: 'किग्रा',
    quintal: 'क्विंटल',
    ton: 'टन',
    piece: 'टुकड़ा',
    dozen: 'दर्जन'
  },
  
  bn: {
    // Common
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    success: 'সফল',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    close: 'বন্ধ',
    send: 'পাঠান',
    back: 'পিছনে',
    next: 'পরবর্তী',
    previous: 'পূর্ববর্তী',
    
    // App
    appTitle: '🌾 এগ্রোমিত্র',
    appSubtitle: 'সরাসরি ক্রেতাদের সাথে যোগাযোগ করুন',
    
    // Auth
    login: 'লগইন',
    register: 'নিবন্ধন',
    phone: 'ফোন নম্বর',
    password: 'পাসওয়ার্ড',
    name: 'পূর্ণ নাম',
    email: 'ইমেল (ঐচ্ছিক)',
    state: 'রাজ্য',
    district: 'জেলা',
    village: 'গ্রাম',
    pincode: 'পিনকোড',
    loginBtn: 'লগইন',
    registerBtn: 'নিবন্ধন',
    
    // Navigation
    marketplace: 'বাজার',
    myListings: 'আমার লিস্টিংস',
    connections: 'সংযোগসমূহ',
    profile: 'প্রোফাইল',
    
    // Marketplace
    filterByCategory: 'বিভাগ অনুযায়ী ফিল্টার',
    allCategories: 'সব বিভাগ',
    noListingsFound: 'কোন লিস্টিং পাওয়া যায়নি',
    
    // Listings
    addListing: 'নতুন লিস্টিং যোগ করুন',
    addListingTitle: 'নতুন লিস্টিং যোগ করুন',
    product: 'পণ্য',
    quantity: 'পরিমাণ',
    price: 'মূল্য',
    quality: 'গুণমানের বর্ণনা',
    harvestDate: 'ফসল তারিখ',
    location: 'অবস্থান',
    submitListing: 'লিস্টিং জমা দিন',
    
    // Status
    active: 'সক্রিয়',
    pending: 'মুলতুবি',
    closed: 'বন্ধ',
    available: 'উপলব্ধ',
    sold: 'বিক্রি হয়েছে',
    expired: 'মেয়াদোত্তীর্ণ',
    
    // Messages
    message: 'বার্তা',
    sendMessage: 'বার্তা পাঠান',
    typeMessage: 'একটি বার্তা টাইপ করুন...',
    noMessages: 'এখনও কোন বার্তা নেই',
    
    // Offline
    offlineMode: 'অফলাইন মোড',
    onlineMode: 'অনলাইন মোড',
    syncInProgress: 'সিঙ্ক হচ্ছে...',
    
    // Notifications
    connectionRequest: 'নতুন সংযোগ অনুরোধ!',
    messageReceived: 'নতুন বার্তা পেয়েছেন',
    listingUpdated: 'লিস্টিং সফলভাবে আপডেট হয়েছে',
    
    // Quality
    excellent: 'চমৎকার',
    good: 'ভাল',
    average: 'গড়',
    
    // Units
    kg: 'কেজি',
    quintal: 'কুইন্টাল',
    ton: 'টন',
    piece: 'টুকরা',
    dozen: 'ডজন'
  },
  
  te: {
    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    close: 'మూసివేయండి',
    send: 'పంపండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    previous: 'మునుపటి',
    
    // App
    appTitle: '🌾 అగ్రోమిత్ర',
    appSubtitle: 'కొనుగోళ్లదారులతో నేరుగా కనెక్ట్ అవ్వండి',
    
    // Auth
    login: 'లాగిన్',
    register: 'నమోదు',
    phone: 'ఫోన్ నంబర్',
    password: 'పాస్వర్డ్',
    name: 'పూర్తి పేరు',
    email: 'ఇమెయిల్ (ఐచ్ఛిక)',
    state: 'రాష్ట్రం',
    district: 'జిల్లా',
    village: 'గ్రామం',
    pincode: 'పిన్‌కోడ్',
    loginBtn: 'లాగిన్',
    registerBtn: 'నమోదు',
    
    // Navigation
    marketplace: 'మార్కెట్',
    myListings: 'నా లిస్టింగ్‌లు',
    connections: 'కనెక్షన్‌లు',
    profile: 'ప్రొఫైల్',
    
    // Marketplace
    filterByCategory: 'వర్గం ద్వారా ఫిల్టర్ చేయండి',
    allCategories: 'అన్ని వర్గాలు',
    noListingsFound: 'లిస్టింగ్‌లు కనుగొనబడలేదు',
    
    // Listings
    addListing: 'కొత్త లిస్టింగ్ జోడించండి',
    addListingTitle: 'కొత్త లిస్టింగ్ జోడించండి',
    product: 'ఉత్పత్తి',
    quantity: 'పరిమాణం',
    price: 'ధర',
    quality: 'నాణ్యత వివరణ',
    harvestDate: 'పంట తేదీ',
    location: 'స్థానం',
    submitListing: 'లిస్టింగ్ సమర్పించండి',
    
    // Status
    active: 'యాక్టివ్',
    pending: 'పెండింగ్',
    closed: 'క్లోజ్డ్',
    available: 'అందుబాటులో ఉంది',
    sold: 'అమ్మబడింది',
    expired: 'గడువు ముగిసింది',
    
    // Messages
    message: 'సందేశం',
    sendMessage: 'సందేశం పంపండి',
    typeMessage: 'ఒక సందేశం టైప్ చేయండి...',
    noMessages: 'ఇంకా సందేశాలు లేవు',
    
    // Offline
    offlineMode: 'ఆఫ్‌లైన్ మోడ్',
    onlineMode: 'ఆన్‌లైన్ మోడ్',
    syncInProgress: 'సింక్ జరుగుతోంది...',
    
    // Notifications
    connectionRequest: 'కొత్త కనెక్షన్ అభ్యర్థన!',
    messageReceived: 'కొత్త సందేశం పొందారు',
    listingUpdated: 'లిస్టింగ్ విజయవంతంగా అప్‌డేట్ చేయబడింది',
    
    // Quality
    excellent: 'అద్భుతం',
    good: 'మంచి',
    average: 'సగటు',
    
    // Units
    kg: 'కిగ్రా',
    quintal: 'క్వింటాల్',
    ton: 'టన్',
    piece: 'ముక్క',
    dozen: 'డజన్'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language)
      localStorage.setItem('preferredLanguage', language)
    }
  }

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
