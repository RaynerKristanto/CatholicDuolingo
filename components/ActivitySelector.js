import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';

const ActivitySelector = ({ activities, selectedActivity, onSelectActivity, onAddActivity, onDeleteActivity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityColor, setNewActivityColor] = useState('#673AB7');

  const predefinedColors = [
    '#673AB7', // Purple
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#E91E63', // Pink
    '#009688', // Teal
  ];

  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      onAddActivity({
        id: Date.now().toString(),
        name: newActivityName.trim(),
        color: newActivityColor,
        isCustom: true,
      });
      setNewActivityName('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.activityTab,
              selectedActivity?.id === activity.id && styles.activeTab,
              { borderBottomColor: activity.color }
            ]}
            onPress={() => onSelectActivity(activity)}
            onLongPress={() => activity.isCustom && onDeleteActivity(activity.id)}
          >
            <Text style={[
              styles.activityText,
              selectedActivity?.id === activity.id && styles.activeTabText,
            ]}>
              {activity.icon} {activity.name}
            </Text>
            {activity.isCustom && (
              <Text style={styles.customBadge}>custom</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Activity</Text>

            <TextInput
              style={styles.input}
              placeholder="Activity name (e.g., Bible Study)"
              value={newActivityName}
              onChangeText={setNewActivityName}
              maxLength={30}
            />

            <Text style={styles.colorLabel}>Choose a color:</Text>
            <View style={styles.colorPicker}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newActivityColor === color && styles.selectedColor
                  ]}
                  onPress={() => setNewActivityColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewActivityName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.addButtonModal,
                  !newActivityName.trim() && styles.disabledButton
                ]}
                onPress={handleAddActivity}
                disabled={!newActivityName.trim()}
              >
                <Text style={styles.addButtonModalText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  activityTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#F3E5F5',
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  customBadge: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  addButtonModal: {
    backgroundColor: '#673AB7',
  },
  addButtonModalText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
});

export default ActivitySelector;
