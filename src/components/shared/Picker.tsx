import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  error?: string;
}

export function Picker({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
  error,
}: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);

  // Use native Picker on Android, modal picker on iOS
  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.pickerWrapper, error && styles.pickerWrapperError]}>
          <RNPicker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            dropdownIconColor={colors.text}
          >
            {items.map((item) => (
              <RNPicker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </RNPicker>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // iOS: Use modal picker
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.pickerButton, error && styles.pickerButtonError]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.pickerButtonText,
            !selectedValue && styles.pickerButtonTextPlaceholder,
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={styles.pickerButtonArrow}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalDoneButton}
              >
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedValue === item.value && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedValue === item.value && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pickerWrapperError: {
    borderColor: colors.error,
  },
  picker: {
    height: spacing.touchTarget,
    color: colors.text,
  },
  pickerButton: {
    height: spacing.touchTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonError: {
    borderColor: colors.error,
  },
  pickerButtonText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  pickerButtonTextPlaceholder: {
    color: colors.textTertiary,
  },
  pickerButtonArrow: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalCancelButton: {
    padding: spacing.sm,
  },
  modalCancelText: {
    ...typography.body,
    color: colors.primary,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text,
  },
  modalDoneButton: {
    padding: spacing.sm,
  },
  modalDoneText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalItemSelected: {
    backgroundColor: colors.primaryLight + '10',
  },
  modalItemText: {
    ...typography.body,
    color: colors.text,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalItemCheck: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
