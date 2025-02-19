import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import WebView from 'react-native-webview';

interface Movie {
    id: number;
    slug_phim: string;
    name: string;
    hinh_anh: string;
    year: string;
    description: string;    
    episodes: Episode[];
}

interface Episode {
    server_name: string;
    server_data: ServerData[];
}

interface ServerData {
    name: string;
    slug: string;
    link_embed: string;
    link_m3u8: string;
}

type RootStackParamList = {
    DetailFilm: { movieSlug: string };
    WatchPage: { movieSlug: string };
};

type WatchPageRouteProp = RouteProp<RootStackParamList, 'WatchPage'>;

const API_URL = 'https://ophim1.com/phim/';

const WatchPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<WatchPageRouteProp>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEpisode, setSelectedEpisode] = useState<ServerData | null>(null);

    useEffect(() => {
        if (!route.params?.movieSlug) {
            setError('Không tìm thấy thông tin phim');
            setLoading(false);
            return;
        }

        fetch(`${API_URL}${route.params.movieSlug}`)
            .then(response => response.json())
            .then(data => {
                if (!data.movie) {
                    setError('Không tìm thấy thông tin phim');
                    return;
                }
                setMovie(data.movie);
                if (data.movie.episodes?.[0]?.server_data?.[0]) {
                    setSelectedEpisode(data.movie.episodes[0].server_data[0]);
                }
                setLoading(false);
            })
            .catch(error => {
                setError('Lỗi khi tải phim');
                setLoading(false);
            });
    }, [route.params?.movieSlug]);
    console.log(movie);
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Lỗi: {error}</Text>
            </View>
        );
    }

    const renderVideoPlayer = () => {
        if (!selectedEpisode?.link_embed) return null;

        // Tạo HTML wrapper cho iframe để đảm bảo responsive
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 0; }
                        .video-container {
                            position: relative;
                            padding-bottom: 56.25%; /* 16:9 */
                            height: 0;
                            overflow: hidden;
                        }
                        .video-container iframe {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            border: 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="video-container">
                        <iframe
                            src="${selectedEpisode.link_embed}"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>
                    </div>
                </body>
            </html>
        `;

        return (
            <WebView
                source={{ html: htmlContent }}
                style={styles.videoPlayer}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>{movie?.name}</Text>
            </View>

            <View style={styles.videoContainer}>
                {selectedEpisode ? renderVideoPlayer() : (
                    <View style={styles.noVideoContainer}>
                        <Text style={styles.noVideoText}>Không có nguồn phát</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.episodeList}>
                    <Text style={styles.sectionTitle}>Danh sách tập phim</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {movie?.episodes?.[0]?.server_data?.map((episode, index) => (
                            <TouchableOpacity
                                key={episode.slug}
                                style={[
                                    styles.episodeButton,
                                    selectedEpisode?.slug === episode.slug && styles.selectedEpisode
                                ]}
                                onPress={() => setSelectedEpisode(episode)}
                            >
                                <Text style={styles.episodeText}>Tập {index + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{movie?.name}</Text>
                    <Text style={styles.releaseYear}>Năm phát hành: {movie?.year}</Text>
                    <Text style={styles.description}>{movie?.description}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    videoPlayer: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    noVideoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noVideoText: {
        color: '#fff',
        fontSize: 16,
    },
    episodeList: {
        padding: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    episodeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#333',
        borderRadius: 20,
        marginRight: 8,
    },
    selectedEpisode: {
        backgroundColor: '#007AFF',
    },
    episodeText: {
        color: '#fff',
    },
    movieInfo: {
        padding: 16,
    },
    movieTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    releaseYear: {
        color: '#888',
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        lineHeight: 20,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 16,
    },
});

export default WatchPage;

