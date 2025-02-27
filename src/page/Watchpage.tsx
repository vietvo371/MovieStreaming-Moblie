import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [selectedServer, setSelectedServer] = useState<string>('');
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!route.params?.movieSlug) {
            setError('Không tìm thấy thông tin phim');
            setLoading(false);
            return;
        }

        fetch(`${API_URL}${route.params.movieSlug}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (!data.movie) {
                    setError('Không tìm thấy thông tin phim');
                    return;
                }
                setMovie(data.movie);
                if (data.episodes) {
                    setEpisodes(data.episodes);
                    setSelectedServer(data.episodes[0].server_name);
                    setSelectedEpisode(data.episodes[0].server_data[0]);
                }
                setLoading(false);
            })
            .catch(error => {
                setError('Lỗi khi tải phim');
                setLoading(false);
            });
    }, [route.params?.movieSlug]);
    console.log(selectedEpisode);
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
        // console.log(selectedEpisode.link_embed);

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
                            src="${selectedEpisode.link_embed}"
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
                <Text numberOfLines={1} style={styles.title}>{movie?.name}</Text>
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
                    <Text style={styles.movieTitle}>{movie?.name}</Text>
                    <View style={styles.movieMeta}>
                        <View style={styles.yearBadge}>
                            <Text style={styles.yearText}>{movie?.year}</Text>
                        </View>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.episodeCount}>
                            {episodes.find(server => server.server_name === selectedServer)?.server_data.length || 0} tập
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chọn Server</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.serverList}
                    >
                        {episodes.map((server) => (
                            <TouchableOpacity
                                key={server.server_name}
                                style={[
                                    styles.serverButton,
                                    selectedServer === server.server_name && styles.selectedServer
                                ]}
                                onPress={() => setSelectedServer(server.server_name)}
                            >
                                <Text style={[
                                    styles.serverText,
                                    selectedServer === server.server_name && styles.selectedServerText
                                ]}>
                                    {server.server_name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tập Phim</Text>
                    <View style={styles.episodeGrid}>
                        {episodes
                            .find(server => server.server_name === selectedServer)
                            ?.server_data.map((episode) => (
                                <TouchableOpacity
                                    key={episode.slug}
                                    style={[
                                        styles.episodeButton,
                                        selectedEpisode?.slug === episode.slug && styles.selectedEpisode
                                    ]}
                                    onPress={() => setSelectedEpisode(episode)}
                                >
                                    <Text style={[
                                        styles.episodeText,
                                        selectedEpisode?.slug === episode.slug && styles.selectedEpisodeText
                                    ]}>
                                        {episode.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nội Dung Phim</Text>
                    <Text style={styles.description}>{movie?.description}</Text>
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
        backgroundColor: '#0a84ff',
        borderColor: '#0a84ff',
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
        backgroundColor: '#0a84ff',
        borderColor: '#0a84ff',
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

