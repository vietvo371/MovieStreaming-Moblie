import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Image,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Dimensions,
    Linking,
    Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api, apiAI } from '../utils/api';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Types
interface Message {
    sender: 'Bot' | 'User';
    text: string;
    time: string;
    isMarkdown?: boolean;
}

interface MoviePreferences {
    liked_movies: number[];
    disliked_movies: number[];
    genres: string[];
    film_types: string[];
    mentioned_movies: string[];
}

interface Movie {
    id: number;
    title: string;
    year?: string;
    genre?: string;
    type?: string;
    summary?: string;
    link?: string;
    image?: string;
    slug?: string;
}

const { width } = Dimensions.get('window');

const Chatbot = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatMode, setChatMode] = useState<'movie' | 'vip'>('movie');
    const [preferences, setPreferences] = useState<MoviePreferences>({
        liked_movies: [],
        disliked_movies: [],
        genres: [],
        film_types: [],
        mentioned_movies: []
    });
    const [movieIdMap, setMovieIdMap] = useState<Record<string, number>>({});
    const scrollViewRef = useRef<ScrollView>(null);

    // Load saved messages and preferences on component mount
    useEffect(() => {
        loadChatFromStorage();
    }, []);

    // Save messages and preferences when they change
    useEffect(() => {
        saveChatToStorage();
    }, [messages, preferences]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    // Load chat from AsyncStorage
    const loadChatFromStorage = async () => {
        try {
            const savedMessages = await AsyncStorage.getItem('chatMessages');
            const savedPreferences = await AsyncStorage.getItem('chatPreferences');
            const savedMode = await AsyncStorage.getItem('chatMode');
            const savedMovieIdMap = await AsyncStorage.getItem('movieIdMap');
            
            if (savedMessages) setMessages(JSON.parse(savedMessages));
            if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
            if (savedMode) setChatMode(JSON.parse(savedMode));
            if (savedMovieIdMap) setMovieIdMap(JSON.parse(savedMovieIdMap));
        } catch (error) {
            console.error('Error loading chat data:', error);
        }
    };

    // Save chat to AsyncStorage
    const saveChatToStorage = async () => {
        try {
            await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
            await AsyncStorage.setItem('chatPreferences', JSON.stringify(preferences));
            await AsyncStorage.setItem('chatMode', JSON.stringify(chatMode));
            await AsyncStorage.setItem('movieIdMap', JSON.stringify(movieIdMap));
        } catch (error) {
            console.error('Error saving chat data:', error);
        }
    };

    // Format time for messages
    const formatTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    // Navigate to movie detail
    const navigateToMovieDetail = useCallback((slug: string) => {
        // Cast navigation to any to resolve the type error temporarily
        // Consider defining proper navigation types for better type safety
        (navigation as any).navigate('DetailFilm', { movieSlug: slug });
    }, [navigation]);

    // Generate a hash code from string (for creating IDs)
    const hashCode = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    // Check if a movie is liked
    const isMovieLiked = (movieId: number): boolean => {
        return preferences.liked_movies.includes(movieId);
    };

    // Like/unlike a movie
    const toggleLikeMovie = async (movie: Movie) => {
        try {
            const movieId = movie.id || hashCode(movie.title);
            const isLiked = isMovieLiked(movieId);
            
            // Update local state
            if (isLiked) {
                setPreferences(prev => ({
                    ...prev,
                    liked_movies: prev.liked_movies.filter(id => id !== movieId)
                }));
            } else {
                setPreferences(prev => ({
                    ...prev,
                    liked_movies: [...prev.liked_movies, movieId]
                }));
                
                // Store movie ID mapping
                setMovieIdMap(prev => ({
                    ...prev,
                    [movie.title]: movieId
                }));
            }
            
            // Send to API
            await apiAI.post('/movie-interaction', {
                movie_id: movieId,
                interaction_type: isLiked ? 'unlike' : 'like',
                movie_title: movie.title
            });
            
            Toast.show({
                type: 'success',
                text1: isLiked ? 'Đã bỏ thích phim' : 'Đã thích phim',
                text2: movie.title,
                position: 'bottom'
            });
        } catch (error) {
            console.error('Error toggling movie like:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update movie preference',
                position: 'bottom'
            });
        }
    };

    // Extract movies from text
    const extractMovies = (text: string): Movie[] => {
        if (!text) return [];
        
        const movies: Movie[] = [];
        const sections = text.split('---');
        
        for (const section of sections) {
            if (!section.trim()) continue;
            
            const titleMatch = section.match(/## (.*?)(\n|$)/);
            if (!titleMatch) continue;
            
            const movieTitle = titleMatch[1].trim();
            
            const yearMatch = section.match(/\*\*Năm phát hành\*\*:\s*(.*?)(\n|$)/);
            const genreMatch = section.match(/\*\*Thể loại\*\*:\s*(.*?)((\n|\|))/);
            const typeMatch = section.match(/\*\*Loại phim\*\*:\s*(.*?)(\n|$)/);
            const summaryMatch = section.match(/\*\*Tóm tắt phim\*\*:\s*(.*?)(\n|$)/);
            const linkMatch = section.match(/\*\*Đường dẫn\*\*:\s*(https?:\/\/[^\s)]+)/);
            const imageMatch = section.match(/!\[.*?\]\((https?:\/\/[^\s)]+)/);
            const slugMatch = linkMatch && linkMatch[1].match(/\/([^\/]+)$/);
            
            let movieId = null;
            if (linkMatch) {
                const urlParts = linkMatch[1].split('/');
                const lastPart = urlParts[urlParts.length - 1];
                movieId = /^\d+$/.test(lastPart) ? parseInt(lastPart) : hashCode(movieTitle);
            } else {
                movieId = hashCode(movieTitle);
            }
            
            movies.push({
                id: movieId,
                title: movieTitle,
                year: yearMatch ? yearMatch[1].trim() : '',
                genre: genreMatch ? genreMatch[1].trim() : '',
                type: typeMatch ? typeMatch[1].trim() : '',
                summary: summaryMatch ? summaryMatch[1].trim() : '',
                link: linkMatch ? linkMatch[1].trim() : '',
                image: imageMatch ? imageMatch[1].trim() : '',
                slug: slugMatch ? slugMatch[1] : undefined
            });
        }
        
        return movies;
    };

    // Check if a message has movie recommendations
    const hasMovieRecommendations = (text: string): boolean => {
        if (!text) return false;
        const patterns = [
            /# Đề Xuất Phim/i,
            /# Phim Ngẫu Nhiên/i,
            /# Kết Quả Tìm Kiếm/i,
            /\*\*Năm phát hành\*\*/i,
            /\*\*Thể loại\*\*/i
        ];
        return patterns.some(pattern => pattern.test(text));
    };

    // Get recommendation title from message
    const getRecommendationTitle = (text: string): string => {
        if (!text) return '';
        const titleMatch = text.match(/# (.*?)(\n|$)/);
        return titleMatch ? titleMatch[1] : '';
    };

    // Get introduction text from recommendation
    const getIntroduction = (text: string): string => {
        if (!text) return '';
        const intro = text.split(/## /)[0];
        if (!intro) return '';
        const titleRemoved = intro.replace(/# .*\n+/, '').trim();
        return titleRemoved;
    };

    // Send message function
    const sendMessage = async () => {
        if (!userInput.trim() || isTyping) return;

        // Add user message
        const userMessage: Message = {
            sender: 'User',
            text: userInput,
            time: formatTime()
        };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsTyping(true);

        try {
            const response = await apiAI.post('/chat', {
                message: currentInput,
                mode: chatMode
            });

            if (response.data.success) {
                // Add bot response
                const botMessage: Message = {
                    sender: 'Bot',
                    text: response.data.response,
                    time: formatTime(),
                    isMarkdown: response.data.is_markdown !== undefined ? response.data.is_markdown : true
                };
                setMessages(prev => [...prev, botMessage]);

                // Update preferences if provided
                if (response.data.preferences) {
                    setPreferences(response.data.preferences);
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send message',
                position: 'bottom'
            });
        } finally {
            setIsTyping(false);
        }
    };

    // Quick reply function
    const quickReply = (message: string) => {
        setUserInput(message);
        sendMessage();
    };

    // Switch chat mode
    const switchMode = (mode: 'movie' | 'vip') => {
        if (chatMode === mode) return;
        
        setChatMode(mode);
        const switchMessage: Message = {
            sender: 'Bot',
            text: mode === 'movie' 
                ? "Bạn đã chuyển sang chế độ trợ lý phim. Tôi có thể giúp bạn tìm kiếm và đề xuất phim."
                : "Bạn đã chuyển sang chế độ trợ lý VIP. Tôi có thể tư vấn về các gói dịch vụ và thanh toán.",
            time: formatTime()
        };
        setMessages(prev => [...prev, switchMessage]);
    };

    // Clear chat history
    const clearChat = async () => {
        try {
            await apiAI.post('/reset-preferences', {
                reset_genres: true,
                reset_film_types: true,
                reset_interactions: true,
                reset_history: true
            });

            setMessages([]);
            setPreferences({
                liked_movies: [],
                disliked_movies: [],
                genres: [],
                film_types: [],
                mentioned_movies: []
            });
            setMovieIdMap({});

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Chat history cleared',
                position: 'bottom'
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear chat history',
                position: 'bottom'
            });
        }
    };

    // Render a movie card
    const renderMovieCard = (movie: Movie) => {
        return (
            <View style={styles.movieCard} key={movie.id}>
                {movie.image ? (
                    <Pressable 
                        onPress={() => movie.slug && navigateToMovieDetail(movie.slug)}
                        style={styles.movieImageContainer}
                    >
                        <Image 
                            source={{ uri: movie.image }}
                            style={styles.movieImage}
                            resizeMode="cover"
                        />
                    </Pressable>
                ) : null}
                <View style={styles.movieDetails}>
                    <Pressable onPress={() => movie.slug && navigateToMovieDetail(movie.slug)}>
                        <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
                    </Pressable>
                    <View style={styles.movieMetaContainer}>
                        {movie.year ? <Text style={styles.movieYear}>{movie.year}</Text> : null}
                        {movie.genre ? <Text style={styles.movieGenre}>{movie.genre}</Text> : null}
                        {movie.type ? <Text style={styles.movieType}>{movie.type}</Text> : null}
                    </View>
                    {movie.summary ? (
                        <Text style={styles.movieSummary} numberOfLines={3}>
                            {movie.summary}
                        </Text>
                    ) : null}
                    <View style={styles.movieActions}>
                        {movie.slug ? (
                            <TouchableOpacity 
                                style={styles.watchButton}
                                onPress={() => navigateToMovieDetail(movie.slug!)}
                            >
                                <Icon name="play-arrow" size={16} color="white" />
                                <Text style={styles.watchButtonText}>Xem phim</Text>
                            </TouchableOpacity>
                        ) : movie.link ? (
                            <TouchableOpacity 
                                style={styles.watchButton}
                                onPress={() => Linking.openURL(movie.link!)}
                            >
                                <Icon name="play-arrow" size={16} color="white" />
                                <Text style={styles.watchButtonText}>Xem phim</Text>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity 
                            style={[
                                styles.likeButton, 
                                isMovieLiked(movie.id) && styles.likedButton
                            ]}
                            onPress={() => toggleLikeMovie(movie)}
                        >
                            <Icon 
                                name={isMovieLiked(movie.id) ? "favorite" : "favorite-border"} 
                                size={20} 
                                color={isMovieLiked(movie.id) ? "#e52d27" : "#777"} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Render message content
    const renderMessageContent = (message: Message) => {
        if (message.sender === 'Bot' && hasMovieRecommendations(message.text)) {
            const title = getRecommendationTitle(message.text);
            const intro = getIntroduction(message.text);
            const movies = extractMovies(message.text);
            
            return (
                <View style={styles.recommendationsContainer}>
                    {title ? <Text style={styles.recommendationTitle}>{title}</Text> : null}
                    {intro ? <Text style={styles.recommendationIntro}>{intro}</Text> : null}
                    {movies.map(movie => renderMovieCard(movie))}
                </View>
            );
        } else if (message.isMarkdown) {
            return (
                <Markdown style={markdownStyles}>
                    {message.text}
                </Markdown>
            );
        } else {
            return (
                <Text style={[
                    styles.messageText,
                    message.sender === 'User' && styles.userMessageText
                ]}>
                    {message.text}
                </Text>
            );
        }
    };

    // Render welcome screen if no messages
    const renderWelcomeScreen = () => {
        return (
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Xin chào! 👋</Text>
                <Text style={styles.welcomeText}>
                    {chatMode === 'movie'
                        ? 'Tôi là trợ lý phim thông minh. Tôi có thể giúp bạn tìm kiếm phim và đề xuất các bộ phim phù hợp với sở thích của bạn.'
                        : 'Tôi là trợ lý dịch vụ VIP. Tôi có thể giúp bạn tìm hiểu về các gói dịch vụ VIP và các ưu đãi đặc biệt.'}
                </Text>
                <View style={styles.suggestionsContainer}>
                    {chatMode === 'movie' ? (
                        <>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Đề xuất phim hành động')}
                            >
                                <Text style={styles.suggestionText}>Phim hành động</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Đề xuất phim tình cảm')}
                            >
                                <Text style={styles.suggestionText}>Phim tình cảm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Phim lẻ hay nhất')}
                            >
                                <Text style={styles.suggestionText}>Phim lẻ hay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Đề xuất phim kinh dị')}
                            >
                                <Text style={styles.suggestionText}>Phim kinh dị</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Thông tin gói VIP')}
                            >
                                <Text style={styles.suggestionText}>Gói VIP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.suggestionChip}
                                onPress={() => quickReply('Ưu đãi đặc biệt')}
                            >
                                <Text style={styles.suggestionText}>Ưu đãi</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        );
    };

    // Render preferences tags
    const renderPreferences = () => {
        if (preferences.genres.length === 0 && preferences.liked_movies.length === 0) {
            return null;
        }
        
        return (
            <View style={styles.preferencesContainer}>
                {preferences.genres.length > 0 && (
                    <View style={styles.preferenceSection}>
                        <Text style={styles.preferenceLabel}>Thể loại yêu thích:</Text>
                        <View style={styles.tagsContainer}>
                            {preferences.genres.map((genre, index) => (
                                <View style={styles.preferenceTag} key={`genre-${index}`}>
                                    <Text style={styles.preferenceTagText}>{genre}</Text>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setPreferences(prev => ({
                                                ...prev,
                                                genres: prev.genres.filter(g => g !== genre)
                                            }));
                                        }}
                                        style={styles.removeTagButton}
                                    >
                                        <Text style={styles.removeTagButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                
                {preferences.liked_movies.length > 0 && (
                    <View style={styles.preferenceSection}>
                        <Text style={styles.preferenceLabel}>Phim đã thích:</Text>
                        <View style={styles.tagsContainer}>
                            {preferences.liked_movies.map((movieId, index) => {
                                // Find movie title from movieIdMap
                                const movieTitle = Object.entries(movieIdMap)
                                    .find(([_, id]) => id === movieId)?.[0] || `Phim #${movieId}`;
                                
                                return (
                                    <View style={styles.preferenceTag} key={`movie-${index}`}>
                                        <Text style={styles.preferenceTagText}>{movieTitle}</Text>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                setPreferences(prev => ({
                                                    ...prev,
                                                    liked_movies: prev.liked_movies.filter(id => id !== movieId)
                                                }));
                                            }}
                                            style={styles.removeTagButton}
                                        >
                                            <Text style={styles.removeTagButtonText}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitle}>
                        <Image 
                            source={{uri: 'https://pics.craiyon.com/2023-06-08/8f12f7763653463289268bdca7185690.webp'}}
                            style={styles.headerIcon}
                        />
                        <Text style={styles.headerText}>Trợ Lý WOPAI</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <View style={styles.modeToggle}>
                            <TouchableOpacity 
                                style={[styles.modeButton, chatMode === 'movie' && styles.modeButtonActive]}
                                onPress={() => switchMode('movie')}
                            >
                                <Icon name="movie" size={16} color="white" style={styles.modeButtonIcon} />
                                <Text style={styles.modeButtonText}>Phim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modeButton, chatMode === 'vip' && styles.modeButtonActive]}
                                onPress={() => switchMode('vip')}
                            >
                                <Icon name="verified" size={16} color="white" style={styles.modeButtonIcon} />
                                <Text style={styles.modeButtonText}>VIP</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
                            <Icon name="delete" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences */}
                {renderPreferences()}

                {/* Messages */}
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContentContainer}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
                >
                    {messages.length === 0 ? (
                        renderWelcomeScreen()
                    ) : (
                        messages.map((message, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.messageWrapper,
                                    message.sender === 'User' ? styles.userMessageWrapper : styles.botMessageWrapper
                                ]}
                            >
                                {message.sender === 'Bot' && (
                                    <Image 
                                        source={{uri: 'https://pics.craiyon.com/2023-06-08/8f12f7763653463289268bdca7185690.webp'}}
                                        style={styles.botAvatar}
                                    />
                                )}
                                <View style={[
                                    styles.messageBubble,
                                    message.sender === 'User' ? styles.userBubble : styles.botBubble,
                                    hasMovieRecommendations(message.text) && styles.recommendationBubble
                                ]}>
                                    {renderMessageContent(message)}
                                </View>
                                <Text style={[
                                    styles.messageTime,
                                    message.sender === 'User' ? styles.userMessageTime : styles.botMessageTime
                                ]}>
                                    {message.time}
                                </Text>
                            </View>
                        ))
                    )}
                    {isTyping && (
                        <View style={styles.typingIndicator}>
                            <View style={styles.typingBubble}>
                                <View style={styles.typingDot} />
                                <View style={[styles.typingDot, styles.typingDotMiddle]} />
                                <View style={styles.typingDot} />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={userInput}
                        onChangeText={setUserInput}
                        placeholder={chatMode === 'movie' ? "Hỏi về phim..." : "Hỏi về VIP..."}
                        placeholderTextColor="#999"
                        onSubmitEditing={sendMessage}
                        multiline
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, !userInput.trim() && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!userInput.trim() || isTyping}
                    >
                        <Icon name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                
                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Powered by @vietvo371</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Markdown styles
const markdownStyles = StyleSheet.create({
    body: {
        color: '#333',
        fontSize: 16,
    },
    heading1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#b31217',
        marginBottom: 10,
        marginTop: 15,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#c43a36',
        marginBottom: 8,
        marginTop: 12,
    },
    heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 10,
    },
    paragraph: {
        marginBottom: 10,
        lineHeight: 22,
    },
    link: {
        color: '#e52d27',
        textDecorationLine: 'underline',
    },
    blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: '#e52d27',
        paddingLeft: 10,
        marginLeft: 10,
        marginVertical: 10,
        fontStyle: 'italic',
        backgroundColor: 'rgba(229, 45, 39, 0.05)',
        padding: 10,
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    list: {
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    listItemBullet: {
        width: 20,
    },
    listItemContent: {
        flex: 1,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fb',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#e52d27',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        marginRight: 15,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    modeButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    modeButtonIcon: {
        marginRight: 5,
    },
    modeButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    clearButton: {
        padding: 5,
    },

    // Preferences Styles
    preferencesContainer: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#f0f0f0', // Light gray background for contrast
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    preferenceSection: {
        marginBottom: 8,
    },
    preferenceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    preferenceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 6,
    },
    preferenceTagText: {
        fontSize: 11,
        color: '#333',
        marginRight: 4,
    },
    removeTagButton: {
        backgroundColor: '#bbb',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
    },
    removeTagButtonText: {
        color: 'white',
        fontSize: 12,
        lineHeight: 14, // Adjust for vertical centering
        fontWeight: 'bold',
    },

    // Messages Styles
    messagesContainer: {
        flex: 1,
    },
    messagesContentContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    messageWrapper: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-end', // Align time below bubble
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    botMessageWrapper: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 2, // Align better with bottom of bubble + time
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 12, // Increased padding
        paddingHorizontal: 16, // Increased padding
        borderRadius: 18,
        // Remove position relative, use alignment in wrapper
    },
    userBubble: {
        backgroundColor: '#e52d27',
        borderBottomRightRadius: 5,
        alignSelf: 'flex-end', 
    },
    botBubble: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 5,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        alignSelf: 'flex-start',
    },
    recommendationBubble: {
        backgroundColor: '#ffffff', // Keep white for cards
        paddingVertical: 0, // Remove padding as cards have their own
        paddingHorizontal: 0,
        borderRadius: 10, // Match card radius
        overflow: 'hidden', // Ensure content stays within bounds
    },
    messageText: {
        fontSize: 16,
        color: '#333', // Default for bot
    },
    userMessageText: {
        color: '#ffffff', // User text color
    },
    messageTime: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,      // Reduced space above time
        marginHorizontal: 5, // Add horizontal margin for breathing room
        // alignSelf is handled by parent wrapper now
    },
    userMessageTime: {
        // Removed alignSelf, handled by userMessageWrapper
        textAlign: 'right', // Ensure time aligns right for user
    },
    botMessageTime: {
        // Removed alignSelf and marginLeft, handled by botMessageWrapper
        textAlign: 'left', // Ensure time aligns left for bot
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginBottom: 15,
        alignSelf: 'flex-start', // Align left like bot messages
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#999',
    },
    typingDotMiddle: {
        marginHorizontal: 4,
    },

    // Input Styles
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120, // Allow multiple lines but limit height
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10, // Adjust vertical padding for multiline
        fontSize: 16,
        marginRight: 12, // Slightly increased margin
        lineHeight: 20, // Improve multiline text readability
    },
    sendButton: {
        backgroundColor: '#e52d27',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#cccccc',
    },

    // Welcome Screen Styles
    welcomeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: 50, // Add some margin from top
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionChip: {
        backgroundColor: 'rgba(229, 45, 39, 0.1)', // Light red background
        borderRadius: 15,
        paddingVertical: 10, // Increased padding
        paddingHorizontal: 16, // Increased padding
        margin: 6, // Adjusted margin
        borderWidth: 1,
        borderColor: 'rgba(229, 45, 39, 0.3)',
    },
    suggestionText: {
        fontSize: 14,
        color: '#e52d27',
        fontWeight: '500',
    },

    // Movie Card Styles
    recommendationsContainer: {
        marginTop: 10, // Add space above recommendations
        paddingHorizontal: 10, // Padding inside the bubble
        paddingBottom: 10,
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#b31217', // Darker red for title
        marginBottom: 5,
        marginLeft: 5, // Align with card content
    },
    recommendationIntro: {
        fontSize: 15,
        color: '#555',
        marginBottom: 15,
        lineHeight: 20,
        marginLeft: 5, // Align with card content
    },
    movieCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderWidth: 1, // Add subtle border
        borderColor: '#eee',
    },
    movieImageContainer: {
        width: 100,
        height: 140, // Adjust height for better aspect ratio
    },
    movieImage: {
        flex: 1, // Make image fill container
        width: undefined, // Required for flex: 1
        height: undefined, // Required for flex: 1
    },
    movieDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between', // Distribute content vertically
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    movieMetaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    movieYear: {
        fontSize: 12,
        color: '#777',
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    movieGenre: {
        fontSize: 12,
        color: '#777',
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 3, // Add margin for wrap
    },
    movieType: {
        fontSize: 12,
        color: '#777',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 3, // Add margin for wrap
    },
    movieSummary: {
        fontSize: 12.5, // Slightly smaller font for summary
        color: '#555',
        lineHeight: 17, // Adjust line height
        marginBottom: 8,
        flexGrow: 1, // Allow summary to take available space
    },
    movieActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto', // Push actions to the bottom
    },
    watchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e52d27',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    watchButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    likeButton: {
        padding: 6,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
    },
    likedButton: {
        backgroundColor: 'rgba(229, 45, 39, 0.1)', // Light red background when liked
    },

    // Footer Styles
    footer: {
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Match input background
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerText: {
        fontSize: 11,
        color: '#999',
    },
});

export default Chatbot;
