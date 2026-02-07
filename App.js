import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import ActivitySelector from './components/ActivitySelector';
import ActivityTracker from './components/ActivityTracker';
import CelebrationModal from './components/CelebrationModal';

// Default activities
const DEFAULT_ACTIVITIES = [
  {
    id: 'mass',
    name: 'Mass',
    icon: '⛪',
    color: '#673AB7',
    isCustom: false,
  },
  {
    id: 'confession',
    name: 'Confession',
    icon: '🙏',
    color: '#2196F3',
    isCustom: false,
  },
  {
    id: 'rosary',
    name: 'Rosary',
    icon: '📿',
    color: '#4CAF50',
    isCustom: false,
  },
  {
    id: 'prayer',
    name: 'Prayer',
    icon: '🕊️',
    color: '#FF9800',
    isCustom: false,
  },
];

export default function App() {
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState(DEFAULT_ACTIVITIES[0]);
  const [attendedDays, setAttendedDays] = useState(new Set());
  const [celebration, setCelebration] = useState({
    visible: false,
    activity: null,
    oldCount: 0,
    newCount: 0,
  });

  // Calculate total count for an activity
  const getActivityCount = (activityId) => {
    return Array.from(attendedDays).filter(key => key.startsWith(`${activityId}-`)).length;
  };

  // Toggle a day for a specific activity
  const handleToggleDay = (activityId, day) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const dateKey = `${activityId}-${currentYear}-${currentMonth}-${day}`;

    const newAttendedDays = new Set(attendedDays);
    const isAdding = !newAttendedDays.has(dateKey);

    if (newAttendedDays.has(dateKey)) {
      newAttendedDays.delete(dateKey);
    } else {
      newAttendedDays.add(dateKey);
    }

    setAttendedDays(newAttendedDays);

    // Show celebration only when adding a day
    if (isAdding) {
      const oldCount = getActivityCount(activityId);
      const newCount = oldCount + 1;
      const activity = activities.find(a => a.id === activityId);

      setCelebration({
        visible: true,
        activity,
        oldCount,
        newCount,
      });
    }
  };

  // Add a custom activity
  const handleAddActivity = (newActivity) => {
    setActivities([...activities, newActivity]);
    setSelectedActivity(newActivity);
  };

  // Delete a custom activity
  const handleDeleteActivity = (activityId) => {
    const activity = activities.find(a => a.id === activityId);

    if (!activity?.isCustom) {
      return; // Can't delete default activities
    }

    Alert.alert(
      'Delete Activity',
      `Are you sure you want to delete "${activity.name}"? All tracking data for this activity will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Remove activity
            const newActivities = activities.filter(a => a.id !== activityId);
            setActivities(newActivities);

            // Remove all tracking data for this activity
            const newAttendedDays = new Set(
              Array.from(attendedDays).filter(key => !key.startsWith(`${activityId}-`))
            );
            setAttendedDays(newAttendedDays);

            // Select the first activity if we deleted the current one
            if (selectedActivity?.id === activityId) {
              setSelectedActivity(newActivities[0]);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ActivitySelector
        activities={activities}
        selectedActivity={selectedActivity}
        onSelectActivity={setSelectedActivity}
        onAddActivity={handleAddActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      <ActivityTracker
        activity={selectedActivity}
        attendedDays={attendedDays}
        onToggleDay={handleToggleDay}
      />

      <CelebrationModal
        visible={celebration.visible}
        activity={celebration.activity}
        oldCount={celebration.oldCount}
        newCount={celebration.newCount}
        onClose={() => setCelebration({ ...celebration, visible: false })}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
