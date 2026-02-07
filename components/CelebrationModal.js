import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions } from 'react-native';

const CelebrationModal = ({ visible, activity, oldCount, newCount, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(oldCount)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Confetti animations
  const confettiAnims = useRef(
    [...Array(12)].map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      countAnim.setValue(oldCount);
      pulseAnim.setValue(1);
      confettiAnims.forEach(anim => {
        anim.translateY.setValue(0);
        anim.translateX.setValue(0);
        anim.rotate.setValue(0);
        anim.opacity.setValue(1);
      });

      // Start animations sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Scale in the card
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate the counter with delay
      setTimeout(() => {
        Animated.timing(countAnim, {
          toValue: newCount,
          duration: 800,
          useNativeDriver: true,
        }).start();

        // Pulse animation for the number
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // Confetti animation
      setTimeout(() => {
        confettiAnims.forEach((anim, index) => {
          const angle = (index / confettiAnims.length) * Math.PI * 2;
          const distance = 150 + Math.random() * 50;
          const endX = Math.cos(angle) * distance;
          const endY = Math.sin(angle) * distance;

          Animated.parallel([
            Animated.timing(anim.translateX, {
              toValue: endX,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: endY,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: (Math.random() - 0.5) * 720,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, 500);

      // Auto close after animation
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      }, 3000);
    }
  }, [visible, oldCount, newCount]);

  if (!visible) return null;

  // Interpolate count for display
  const displayCount = countAnim.interpolate({
    inputRange: [oldCount, newCount],
    outputRange: [oldCount, newCount],
  });

  const getMessage = () => {
    const count = newCount;
    const milestones = [
      { threshold: 1, message: "Great start!" },
      { threshold: 5, message: "Keep it up!" },
      { threshold: 10, message: "You're on fire!" },
      { threshold: 25, message: "Amazing dedication!" },
      { threshold: 50, message: "Incredible milestone!" },
      { threshold: 100, message: "Truly inspiring!" },
    ];

    for (let i = milestones.length - 1; i >= 0; i--) {
      if (count >= milestones[i].threshold) {
        return milestones[i].message;
      }
    }
    return "Well done!";
  };

  const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D'];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: activity?.color || '#673AB7' }]}>
            <Text style={styles.icon}>{activity?.icon}</Text>
          </View>

          <Text style={styles.activityName}>{activity?.name}</Text>

          <View style={styles.counterContainer}>
            <Animated.Text
              style={[
                styles.oldCount,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              {oldCount}
            </Animated.Text>
            <Text style={styles.arrow}>→</Text>
            <Animated.Text
              style={[
                styles.newCount,
                { color: activity?.color || '#673AB7' },
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              {newCount}
            </Animated.Text>
          </View>

          <Text style={styles.message}>{getMessage()}</Text>
          <Text style={styles.subtitle}>Total times completed</Text>
        </Animated.View>

        {/* Confetti particles */}
        <View style={styles.confettiContainer}>
          {confettiAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: confettiColors[index % confettiColors.length],
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.translateX },
                    { translateY: anim.translateY },
                    { rotate: anim.rotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ]
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 40,
  },
  activityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  oldCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#CCC',
    textDecorationLine: 'line-through',
    marginRight: 15,
  },
  arrow: {
    fontSize: 32,
    color: '#999',
    marginRight: 15,
  },
  newCount: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  confettiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 1,
    height: 1,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default CelebrationModal;
