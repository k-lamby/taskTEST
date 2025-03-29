//================== CustomDatePicker.js =======================//
// This is a custom date picker modal, utilises the spin style
// to allow the user to select a due date
//==============================================================//

import React, { useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import GlobalStyles from '../../styles/styles';

const CustomDatePicker = ({ visible, onClose, onDateChange, title }) => {
  // state to get the new date, formatted as a date
  const [date, setDate] = useState(new Date());

  // handler for managing the date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  // once done, we then pass the date back to the parent 
  // and close the modal
  const handleDone = () => {
    onDateChange(date);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={GlobalStyles.modal.overlay}>
        <View style={GlobalStyles.modal.container}>
          <Text style={GlobalStyles.text.headerMd}>{title}</Text>

          {/* Use the date time picker from the react community */}
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
          <View style={{ width: '100%', marginTop: 20, gap: 10, alignItems: 'center' }}>
            <Pressable
              style={GlobalStyles.button.primary}
              onPress={handleDone}
              accessibilityLabel="Confirm date selection"
            >
              <Text style={GlobalStyles.button.text}>Done</Text>
            </Pressable>

            <Pressable onPress={onClose} accessibilityLabel="Close date picker">
              <Text style={GlobalStyles.text.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDatePicker;