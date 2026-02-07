import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ActivityTracker = ({ activity, attendedDays, onToggleDay }) => {
  // Get current month info
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day abbreviations
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if a day is marked as attended
  const isAttended = (day) => {
    const dateKey = `${activity.id}-${currentYear}-${currentMonth}-${day}`;
    return attendedDays.has(dateKey);
  };

  // Check if day is Sunday
  const isSunday = (day) => {
    return new Date(currentYear, currentMonth, day).getDay() === 0;
  };

  // Generate calendar grid
  const renderCalendar = () => {
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attended = isAttended(day);
      const sunday = isSunday(day);
      const isToday = day === today;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            styles.dayButton,
            attended && { ...styles.attendedDay, backgroundColor: activity.color },
            sunday && !attended && styles.sundayDay,
            isToday && styles.todayDay,
          ]}
          onPress={() => onToggleDay(activity.id, day)}
        >
          <Text style={[
            styles.dayText,
            attended && styles.attendedDayText,
            sunday && !attended && styles.sundayText,
            isToday && styles.todayText,
          ]}>
            {day}
          </Text>
          {attended && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Count total attendances this month
  const monthAttendanceCount = Array.from(attendedDays).filter(
    key => key.startsWith(`${activity.id}-${currentYear}-${currentMonth}`)
  ).length;

  // Count total attendances all time
  const totalCount = Array.from(attendedDays).filter(
    key => key.startsWith(`${activity.id}-`)
  ).length;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: activity.color }]}>
        <Text style={styles.title}>{activity.icon} {activity.name}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.totalCount}>{totalCount}</Text>
          <Text style={styles.totalLabel}>Total Times</Text>
        </View>
        <Text style={styles.monthYear}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <Text style={styles.stats}>
          {monthAttendanceCount} {monthAttendanceCount === 1 ? 'day' : 'days'} this month
        </Text>
      </View>

      <View style={styles.calendar}>
        {/* Day names header */}
        <View style={styles.daysHeader}>
          {dayNames.map((name) => (
            <View key={name} style={styles.dayNameCell}>
              <Text style={styles.dayName}>{name}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {renderCalendar()}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.sundayDay]} />
          <Text style={styles.legendText}>Sunday</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: activity.color }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Tap any day to mark it as completed. Tap again to unmark.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  totalCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  totalLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  monthYear: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  stats: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  calendar: {
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 5,
  },
  dayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  sundayDay: {
    backgroundColor: '#FFF9C4',
  },
  sundayText: {
    color: '#F57C00',
    fontWeight: '600',
  },
  attendedDay: {
    // Color will be set dynamically based on activity
  },
  attendedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  todayText: {
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  instructions: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ActivityTracker;
