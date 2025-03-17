import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions } from 'react-native';
import{ api } from  '../utils/api';

interface BlogPost {
  id: number;
  tieu_de: string;
  hinh_anh: string;
  mo_ta: string;
  mo_ta_chi_tiet: string;
  ten_chuyen_muc: string;
  created_at: string;
}

type RootStackParamList = {
  BlogDetail: { blogSlug: string };
};

type BlogDetailProps = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

const BlogDetail = ({ route, navigation }: BlogDetailProps) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const getBlogDetail = async () => {
    try {
      const response = await api.post('bai-viet/lay-du-lieu-delist-blog', {
        slug: route.params.blogSlug
      });
      setPost(response.data.bai_viet);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [route.params.blogSlug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (!post) return null;

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Featured Image */}
        <Image
          source={{ uri: post.hinh_anh }}
          style={styles.featuredImage}
        />

        {/* Content */}
        <View style={styles.articleContent}>
          <Text style={styles.category}>{post.ten_chuyen_muc}</Text>
          <Text style={styles.title}>{post.tieu_de}</Text>
          <Text style={styles.date}>
            {new Date(post.created_at).toLocaleDateString('vi-VN')}
          </Text>

          <Text style={styles.description}>{post.mo_ta}</Text>

          <View style={styles.divider} />

          <Text style={styles.detailContent}>{post.mo_ta_chi_tiet}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
    paddingTop: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 300,
  },
  articleContent: {
    padding: 16,
  },
  category: {
    color: '#FF4500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  description: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  detailContent: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
  },
  htmlContent: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default BlogDetail;
