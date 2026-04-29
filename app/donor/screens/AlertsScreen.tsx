import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../../services/api'; // adjust path

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);

  // ✅ Fetch donations and convert to alerts
  const fetchAlerts = async () => {
    try {
      const res = await API.get('/donor/donations');

      const generatedAlerts = res.data.map((item: any) => {
        let type = 'default';
        let title = '';
        let message = '';

        if (item.status === 'accepted') {
          type = 'ngo';
          title = 'NGO Assigned';
          message = 'Your donation has been accepted by an NGO.';
        } else if (item.status === 'picked') {
          type = 'volunteer';
          title = 'Volunteer Assigned';
          message = 'Volunteer is on the way.';
        } else if (item.status === 'completed') {
          type = 'completed';
          title = 'Donation Completed';
          message = 'Food delivered successfully.';
        } else {
          type = 'default';
          title = 'Donation Created';
          message = 'Waiting for NGO to accept.';
        }

        return {
          id: item._id,
          type,
          title,
          message,
          time: new Date(item.createdAt).toLocaleString(),
          unread: true,
        };
      });

      setAlerts(generatedAlerts);
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.log(err.response?.data || err.message || String(error));
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <ScrollView style={styles.list}>
        {alerts.map((item) => (
          <AlertCard
            key={item.id}
            item={item}
            onPress={() => markAsRead(item.id)}
            onDelete={() => deleteAlert(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* 🔥 Alert Card */
function AlertCard({ item, onPress, onDelete }: any) {
  const getIcon = () => {
    switch (item.type) {
      case 'ngo':
        return { name: 'business' as const, color: '#3B82F6', bg: '#DBEAFE' };
      case 'volunteer':
        return { name: 'person' as const, color: '#F59E0B', bg: '#FEF3C7' };
      case 'completed':
        return { name: 'checkmark-done' as const, color: '#22C55E', bg: '#DCFCE7' };
      default:
        return { name: 'notifications' as const, color: '#6B7280', bg: '#E5E7EB' };
    }
  };

  const icon = getIcon();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, item.unread && styles.unread]}
    >
      <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={18} color={icon.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  header: {
    backgroundColor: '#2ECC71',
    padding: 30,
    marginTop:30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  list: {
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  unread: {
    backgroundColor: '#ECFDF5',
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontWeight: 'bold',
  },

  message: {
    color: '#4B5563',
    marginTop: 2,
  },

  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});