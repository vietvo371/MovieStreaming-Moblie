import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../utils/api';

interface Movie {
    id: number;
    slug_phim: string;
    ten_phim: string;
    hinh_anh: string;
    nam_san_xuat: string;
    mo_ta: string;
    episodes: Episode[];
    thoi_gian_chieu: number;
    quoc_gia: string;
    ngon_ngu: string;
    chat_luong: string;
    tong_luot_xem: number;
}

interface Episode {
    so_tap: string;
    slug_tap_phim: string;
    url: string;
    link_m3u8: string;
}

interface ServerData {
    so_tap: string;
    slug_tap_phim: string;
    url: string;
    link_m3u8: string;
}

type RootStackParamList = {
    DetailFilm: { movieSlug: string };
    WatchPage: { movieSlug: string, episodeSlug: string };
};

type WatchPageRouteProp = RouteProp<RootStackParamList, 'WatchPage'>;


const WatchPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<WatchPageRouteProp>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEpisode, setSelectedEpisode] = useState<ServerData | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [selectedServer, setSelectedServer] = useState<string>('');
    const insets = useSafeAreaInsets();

    const getMovieDetail = async () => {
        try {
            const response = await api.post('lay-data-watch', {
                "slugMovie": route.params?.movieSlug,
                "slugEpisode": route.params?.episodeSlug
            });
            console.log(response.data);
            setMovie(response.data.phim);
            setEpisodes(response.data.tap_phims);
            setSelectedEpisode(response.data.tap_phims[0]);
            setLoading(false);
        } catch (error: any) {
            console.error(error.response);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!route.params?.movieSlug) {
            setError('Không tìm thấy thông tin phim');
            setLoading(false);
            return;
        }
        getMovieDetail();
    }, [route.params?.movieSlug]);
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
        if (!selectedEpisode?.url) return null;
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            margin: 0; 
                            padding: 0;
                            background-color: #000;
                        }
                        .video-container {
                            position: relative;
                            padding-bottom: 56.25%; /* 16:9 */
                            height: 0;
                            overflow: hidden;
                            background-color: #000;
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
                            src="${selectedEpisode.url}"
                            frameborder="0"
                            allow="autoplay; fullscreen"
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
                mediaPlaybackRequiresUserAction={false}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error:', nativeEvent);
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.title}>{movie?.ten_phim}</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Icon name="dots-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.videoContainer}>
                {selectedEpisode ? renderVideoPlayer() : (
                    <View style={styles.noVideoContainer}>
                        <Icon name="video-off" size={40} color="#666" />
                        <Text style={styles.noVideoText}>Không có nguồn phát</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.movieInfoBrief}>
                    <Text style={styles.movieTitle}>{movie?.ten_phim}</Text>
                    <View style={styles.movieMeta}>
                        <View style={styles.yearBadge}>
                            <Text style={styles.yearText}>{movie?.nam_san_xuat}</Text>
                        </View>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.episodeCount}>
                            {episodes.length || 1} tập
                        </Text>
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tập Phim</Text>
                    <View style={styles.episodeGrid}>
                        {episodes
                            .map((episode) => (
                                <TouchableOpacity
                                    key={episode.slug_tap_phim}
                                    style={[
                                        styles.episodeButton,
                                        selectedEpisode?.slug_tap_phim === episode.slug_tap_phim && styles.selectedEpisode
                                    ]}
                                    onPress={() => setSelectedEpisode(episode)}
                                >
                                    <Text style={[
                                        styles.episodeText,
                                        selectedEpisode?.slug_tap_phim === episode.slug_tap_phim && styles.selectedEpisodeText
                                    ]}>
                                        Tập {episode.so_tap}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nội Dung Phim</Text>
                    <Text style={styles.description}>{movie?.mo_ta}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#161616',
    },
    backButton: {
        padding: 4,
    },
    menuButton: {
        padding: 4,
    },
    title: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
    },
    movieInfoBrief: {
        padding: 16,
        backgroundColor: '#161616',
    },
    movieTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    movieMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yearBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    yearText: {
        color: '#fff',
        fontSize: 13,
    },
    dotSeparator: {
        color: '#666',
        marginHorizontal: 8,
        fontSize: 16,
    },
    episodeCount: {
        color: '#666',
        fontSize: 14,
    },
    section: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    serverList: {
        marginBottom: 8,
    },
    serverButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#222',
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedServer: {
        backgroundColor: '#FF4500',
        borderColor: '#FF4500',
    },
    serverText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedServerText: {
        fontWeight: '600',
    },
    episodeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    episodeButton: {
        width: '23%',
        margin: '1%',
        aspectRatio: 1,
        backgroundColor: '#222',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedEpisode: {
        backgroundColor: '#FF4500',
        borderColor: '#FF4500',
    },
    episodeText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedEpisodeText: {
        fontWeight: '600',
    },
    noVideoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161616',
    },
    noVideoText: {
        color: '#666',
        fontSize: 16,
        marginTop: 12,
    },
    description: {
        color: '#ccc',
        fontSize: 15,
        lineHeight: 22,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 16,
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
});

export default WatchPage;

