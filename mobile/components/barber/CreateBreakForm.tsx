import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

type BreakProps = {
    selectedStartMin?: number;
    selectedEndMin?: number;
    onSelectStartMin?: (min: number) => void;
    onSelectEndMin?: (min: number) => void;
}

export default function CreateBreakForm({ selectedStartMin, selectedEndMin, onSelectStartMin, onSelectEndMin }: BreakProps) {
    
    const generateTimeSlots = () => {
        const slots = [];
        for (let min = 480; min <= 1440; min += 15) {
            slots.push(min);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const TimeSelector = ({ 
        label, 
        selectedMin, 
        onSelect 
    }: { 
        label: string; 
        selectedMin?: number; 
        onSelect?: (min: number) => void 
    }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <View style={styles.selectorContainer}>
                <Text style={styles.label}>{label}</Text>
                
                <TouchableOpacity 
                    style={styles.selectedTime}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text style={styles.selectedTimeText}>
                        {selectedMin !== undefined ? formatTime(selectedMin) : 'Seçiniz'}
                    </Text>
                    <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isOpen && (
                    <ScrollView 
                        style={styles.dropdown}
                        nestedScrollEnabled={true}
                    >
                        {timeSlots.map((min) => (
                            <TouchableOpacity
                                key={min}
                                style={[
                                    styles.timeOption,
                                    selectedMin === min && styles.timeOptionSelected
                                ]}
                                onPress={() => {
                                    onSelect?.(min);
                                    setIsOpen(false);
                                }}
                            >
                                <Text style={[
                                    styles.timeOptionText,
                                    selectedMin === min && styles.timeOptionTextSelected
                                ]}>
                                    {formatTime(min)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            
            <TimeSelector
                label="Başlangıç Saati"
                selectedMin={selectedStartMin}
                onSelect={onSelectStartMin}
            />

            <TimeSelector
                label="Bitiş Saati"
                selectedMin={selectedEndMin}
                onSelect={onSelectEndMin}
            />

            {selectedStartMin !== undefined && selectedEndMin !== undefined && (
                <View style={styles.durationInfo}>
                    <Text style={styles.durationText}>
                        Mola Süresi: {Math.max(0, selectedEndMin - selectedStartMin)} dakika
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
        paddingVertical: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#fff',
    },
    selectorContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#AD8C57',
    },
    selectedTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedTimeText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    arrow: {
        fontSize: 12,
        color: '#666',
    },
    dropdown: {
        maxHeight: 200,
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timeOption: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    timeOptionSelected: {
        backgroundColor: '#AD8C57',
    },
    timeOptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    timeOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    durationInfo: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#000',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#AD8C57',
    },
    durationText: {
        fontSize: 16,
        color: '#AD8C57',
        fontWeight: '600',
        textAlign: 'center',
    },
});