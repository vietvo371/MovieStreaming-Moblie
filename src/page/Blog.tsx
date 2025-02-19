import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface BlogPost {
  id: number;
  tieu_de: string;
  hinh_anh: string;
  mo_ta: string;
  ten_chuyen_muc: string;
  slug_tieu_de: string;
}

type RootStackParamList = {
  BlogDetail: { blogSlug: string };
};

const API_URL = 'https://wopai-be.dzfullstack.edu.vn/api/bai-viet/lay-du-lieu-show';

const BlogPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setBlogPosts(data.bai_viet.dataAdmin.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog Phim</Text>
        <Text style={styles.headerSubtitle}>Tin tức & đánh giá phim mới nhất</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Featured Blog - First Post */}
        {blogPosts.length > 0 && (
          <TouchableOpacity 
            style={styles.featuredBlog}
            onPress={() => navigation.navigate('BlogDetail', { blogSlug: blogPosts[0].slug_tieu_de })}
          >
            <Image 
              source={{ uri: blogPosts[0].hinh_anh }} 
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.gradient}
            >
              <Text style={styles.featuredCategory}>{blogPosts[0].ten_chuyen_muc}</Text>
              <Text style={styles.featuredTitle}>{blogPosts[0].tieu_de}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Blog List */}
        <View style={styles.blogList}>
          {blogPosts.slice(1).map(post => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.blogCard}
              onPress={() => navigation.navigate('BlogDetail', { blogSlug: post.slug_tieu_de })}
            >
              <Image source={{ uri: post.hinh_anh }} style={styles.blogImage} />
              <View style={styles.blogContent}>
                <Text style={styles.blogCategory}>{post.ten_chuyen_muc}</Text>
                <Text style={styles.blogTitle} numberOfLines={2}>
                  {post.tieu_de}
                </Text>
                <Text style={styles.blogDescription} numberOfLines={2}>
                  {post.mo_ta}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  header: {
    padding: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  featuredBlog: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredCategory: {
    color: '#FF4500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  blogList: {
    padding: 16,
  },
  blogCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 200,
  },
  blogContent: {
    padding: 16,
  },
  blogCategory: {
    color: '#FF4500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default BlogPage;
