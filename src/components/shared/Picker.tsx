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
import { useTheme } from '../../context/ThemeContext';
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
  const { currentColors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);

  // Use native Picker on Android, modal picker on iOS
  if (Platform.OS === 'android') {
    const styles = StyleSheet.create({
      container: {
        marginBottom: spacing.md,
      },
      label: {
        ...typography.bodySmall,
        color: currentColors.text,
        marginBottom: spacing.sm,
        fontWeight: '500',
      },
      pickerWrapper: {
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        backgroundColor: currentColors.surface,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
      pickerWrapperError: {
        borderColor: currentColors.error,
      },
      picker: {
        height: spacing.touchTarget,
        color: currentColors.text,
      },
      errorText: {
        ...typography.caption,
        color: currentColors.error,
        marginTop: spacing.xs,
      },
    });

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.pickerWrapper, error && styles.pickerWrapperError]}>
          <RNPicker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            dropdownIconColor={currentColors.text}
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
  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.bodySmall,
      color: currentColors.text,
      marginBottom: spacing.sm,
      fontWeight: '500',
    },
    pickerButton: {
      height: spacing.touchTarget,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      backgroundColor: currentColors.surface,
      paddingHorizontal: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    pickerButtonError: {
      borderColor: currentColors.error,
    },
    pickerButtonText: {
      ...typography.body,
      color: currentColors.text,
      flex: 1,
    },
    pickerButtonTextPlaceholder: {
      color: currentColors.textTertiary,
    },
    pickerButtonArrow: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginLeft: spacing.sm,
    },
    errorText: {
      ...typography.caption,
      color: currentColors.error,
      marginTop: spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: currentColors.surface,
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
      borderBottomColor: currentColors.borderLight,
    },
    modalCancelButton: {
      padding: spacing.sm,
    },
    modalCancelText: {
      ...typography.body,
      color: currentColors.primary,
    },
    modalTitle: {
      ...typography.h4,
      color: currentColors.text,
    },
    modalDoneButton: {
      padding: spacing.sm,
    },
    modalDoneText: {
      ...typography.body,
      color: currentColors.primary,
      fontWeight: '600',
    },
    modalItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    modalItemSelected: {
      backgroundColor: currentColors.primaryLight + '10',
    },
    modalItemText: {
      ...typography.body,
      color: currentColors.text,
    },
    modalItemTextSelected: {
      color: currentColors.primary,
      fontWeight: '600',
    },
    modalItemCheck: {
      ...typography.body,
      color: currentColors.primary,
      fontWeight: 'bold',
    },
  });

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
