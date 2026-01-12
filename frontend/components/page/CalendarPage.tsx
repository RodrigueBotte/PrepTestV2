import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {Calendar} from 'react-native-calendars'
import apiClient from "../service/api";

interface Event {
    id: string;
    title: string;
    date: string;
}

export default function CalendarPage(){
    const [dateSelected, setDateSelected]= useState('');
    const [events, setEvents] = useState<Record<string, any>>([]);
    const [eventsData, setEventsData] = useState<Event[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);

    useEffect(()=>{
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
  try {
    const response = await apiClient.get('/api/event');
    let eventsData: Event[] = response.data;
    
    console.log('📥 API brute:', eventsData);
    
    // 🔥 NORMALISE les dates ISO → YYYY-MM-DD
    const normalizedEvents = eventsData.map(event => ({
      ...event,
      date: event.date.split('T')[0]  // "2026-01-12T00:00:00+00:00" → "2026-01-12"
    }));
    
    console.log('✅ Normalisées:', normalizedEvents);
    setEventsData(normalizedEvents);
    
    // 🔥 markedDates avec BON format
    const markedDates: Record<string, any> = {};
    normalizedEvents.forEach(event => {
      markedDates[event.date] = {
        marked: true,
        dotColor: '#007AFF',
        markingType: 'dot'
      };
    });
    
    console.log('🎨 markedDates:', markedDates);
    setEvents(markedDates);
    
  } catch (error) {
    console.error('❌ fetchEvents:', error);
  }
};

    const handleDayPress = (day: any) =>{
        setDateSelected(day.dateString);
        const dayEvents = eventsData.filter((event)=>event.date === day.dateString);
        setSelectedDateEvents(dayEvents);
        setModalVisible(true);
        console.log('📅 Date cliquée:', day.dateString);
        console.log('📊 eventsData dispo:', eventsData);      // ✅ Regarde si données
        console.log('🔍 Filtre sur:', day.dateString);
    }

    const createEvent = async () => {
    if (!newEventTitle.trim()) {
      Alert.alert('Erreur', 'Titre obligatoire');
      return;
    }

    try {
      const response = await apiClient.post('/api/events', {
        title: newEventTitle,
        date: dateSelected,
      });

      // Rafraîchir les événements
      await fetchEvents();
      setNewEventTitle('');
      
      Alert.alert('Succès', 'Événement créé !');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec création événement');
    }
  };

  const deleteEvent = async (eventId: string) => {
    console.log('🗑️ Suppr:', eventId);
    
    if (Platform.OS === 'web') {
      if (confirm(`Supprimer ID ${eventId} ?`)) {
        await apiClient.delete(`/api/events/${eventId}`);
        await fetchEvents();
      }
    } else {
      Alert.alert('Supprimer', `ID: ${eventId}`, [
        { text: 'Non' },
        {
          text: 'Oui',
          onPress: async () => {
            apiClient.delete(`/api/events/${eventId}`).then(fetchEvents);
            await fetchEvents();
          }
        }
      ]);
    }
  };

    return (
    <View style={styles.container}>
      <Calendar
        current="2026-01-12"
        onDayPress={handleDayPress}
        markedDates={events}
        theme={calendarTheme}
        markingType="dot"
      />

      {/* Modal événements */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Événements - {dateSelected}
          </Text>

          {/* Liste des événements existants */}
          <FlatList
            data={selectedDateEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <TouchableOpacity
                  onPress={() => deleteEvent(item.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.eventsList}
          />

          {/* Ajouter nouvel événement */}
          <View style={styles.newEventContainer}>
            <TextInput
              style={styles.eventInput}
              placeholder="Nouveau événement..."
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TouchableOpacity
              onPress={createEvent}
              style={styles.addBtn}
              disabled={!newEventTitle.trim()}
            >
              <Text style={styles.addBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeBtnText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const calendarTheme = {
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  selectedDayBackgroundColor: '#007AFF',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#007AFF',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventsList: { maxHeight: 300, marginBottom: 20 },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventTitle: { fontSize: 16, flex: 1 },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  newEventContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  eventInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  closeBtn: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});