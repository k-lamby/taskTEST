import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import GlobalStyles from '../styles/styles';

const CustomDatePicker = ({ visible, onClose, onDateChange, title }) => {
    const [date, setDate] = useState(new Date());

    // Handler for when the user changes the date picker
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); 
    };

    // Called when the user hits the done button
    const handleDone = () => {
        onDateChange(date);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Custom title for the modal */}
                    <Text style={GlobalStyles.headerText}>{title}</Text>
                    
                    <DateTimePicker
                        value={date}
                        mode="date" 
                        display="spinner"
                        onChange={handleDateChange}
                    />

                    {/* Button container */}
                    <View style={styles.buttonContainer}>
                        <Pressable style={GlobalStyles.primaryButton} onPress={handleDone}>
                            <Text style={GlobalStyles.primaryButtonText}>Done</Text>
                        </Pressable>
                        <Pressable onPress={onClose}>
                            <Text style={styles.closeButton}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#001524', 
        borderRadius: 20,
        padding: 20, 
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'column', // ✅ Stacks buttons vertically
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        gap: 10, // Adds spacing between the buttons
    },
    closeButton: {
        marginTop: 10,
        color: "#FFFFFF",
        textDecorationLine: "underline",
        textAlign: "center",
    },
});

export default CustomDatePicker;