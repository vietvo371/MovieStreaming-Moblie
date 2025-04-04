import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/image/onboarding1.jpg'),
    title: 'Xem trên bất kỳ thiết bị nào',
    description: 'Phát trực tuyến trên điện thoại, máy tính bảng, laptop và TV của bạn.',
  },
  {
    id: '2',
    image: require('../../assets/image/onboarding2.jpg'),
    title: 'Tích hợp AI thông minh',
    description: 'Tích hợp AI thông minh để tự động tìm kiếm và xem phim phù hợp với bạn.',
  },
  {
    id: '3',
    image: require('../../assets/image/onboarding3.jpg'),
    title: 'Không có quảng cáo, không ràng buộc',
    description: 'Hủy bất cứ lúc nào. Không có hợp đồng phiền phức.',
  },
];

const OnboardingScreen = ({ navigation }: { navigation: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<Swiper>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      swiperRef.current?.scrollBy(1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/image/logoW.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => setCurrentIndex(index)}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={slide.image} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                style={styles.gradient}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </Swiper>
      
      {/* Next/Get Started button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'BẮT ĐẦU' : 'TIẾP THEO'}
        </Text>
        {currentIndex < slides.length - 1 && (
          <Icon name="chevron-forward" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: height * 0.6,
    position: 'absolute',
    top: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 150,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#e5e5e5',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    bottom: 120,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: '#E50914',
    width: 20,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 60,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default OnboardingScreen;