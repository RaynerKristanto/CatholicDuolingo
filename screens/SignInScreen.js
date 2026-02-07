import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);

  // Configure Google OAuth
  // You'll need to replace these with your actual Google OAuth credentials
  const [request, response, promptAsync] = Google.useAuthRequest({
    // For web - you'll need to create these in Google Cloud Console
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    // For iOS - you'll need to create these in Google Cloud Console
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    // For Android - you'll need to create these in Google Cloud Console
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  const handleGoogleSignIn = async (authentication) => {
    try {
      setLoading(true);

      // Get user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );

      const userInfo = await userInfoResponse.json();

      // Pass user info to parent component
      onSignIn({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: authentication.accessToken,
      });

    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    promptAsync();
  };

  // Development mode - skip authentication (for testing only)
  const handleDevSignIn = () => {
    onSignIn({
      id: 'dev-user',
      email: 'developer@test.com',
      name: 'Dev User',
      picture: null,
      accessToken: 'dev-token',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>⛪</Text>
          <Text style={styles.appName}>Catholic Duolingo</Text>
          <Text style={styles.tagline}>Learn your faith, one lesson at a time</Text>
        </View>

        {/* Sign In Section */}
        <View style={styles.signInContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Sign in to track your spiritual journey across all your devices
          </Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleSignIn}
            disabled={loading || !request}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Development Mode Button */}
          <TouchableOpacity
            style={styles.devButton}
            onPress={handleDevSignIn}
          >
            <Text style={styles.devButtonText}>Continue as Dev User (Testing)</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By signing in, you agree to sync your spiritual activity data
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your privacy matters. We only access your basic profile information.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#673AB7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  signInContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  devButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  devButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default SignInScreen;
