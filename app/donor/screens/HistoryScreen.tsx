import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../../services/api'; // adjust path

export default function HistoryScreen() {
  const [data, setData] = useState<any[]>([]);

  // ✅ Fetch donation history
  const fetchHistory = async () => {
    try {
      const res = await API.get('/donor/donations');

      // Filter only past donations
      const history = res.data.filter(
        (item: any) =>
          item.status === 'completed' ||
          item.status === 'rejected'
      );

      setData(history);
    } catch (err: unknown) {
      const error = err as any;
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Donation History</Text>
      </View>

      {/* List */}
      <View style={styles.list}>
        {data.map((item) => (
          <HistoryCard key={item._id} item={item} />
        ))}
      </View>

    </ScrollView>
  );
}

/* 🔥 Card */
function HistoryCard({ item }: any) {

  const getStatusUI = () => {
    switch (item.status) {
      case 'completed':
        return {
          icon: 'checkmark-circle' as const,
          bg: '#DCFCE7',
          color: '#16A34A',
        };
      case 'pending':
        return {
          icon: 'time' as const,
          bg: '#FEF3C7',
          color: '#CA8A04',
        };
      case 'rejected':
        return {
          icon: 'close-circle' as const,
          bg: '#FEE2E2',
          color: '#DC2626',
        };
      default:
        return {
          icon: 'help-circle' as const,
          bg: '#E5E7EB',
          color: '#374151',
        };
    }
  };

  const status = getStatusUI();

  return (
    <View style={styles.card}>

      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: status.bg }]}>
        <Ionicons name={status.icon} size={20} color={status.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.qty}>{item.quantity}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={[styles.badge, { backgroundColor: status.bg }]}>
        <Text style={{ color: status.color, fontSize: 12 }}>
          {item.status}
        </Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
   container: 
   { flex: 1,
     backgroundColor: '#F3F4F6', 
    }, 
   header:
    { backgroundColor: '#2ECC71', 
      padding: 30, 
      marginTop:30,
       borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10, 
    }, 
    headerText: 
    { color: 'white', 
      fontSize: 20, 
      fontWeight: 'bold',
   }, 
   list: 
   { padding: 16,
    }, 
    card:
    { flexDirection: 'row',
       backgroundColor: 'white', 
       padding: 12, 
       borderRadius: 12,
        marginBottom: 12,
         alignItems: 'center', 
    }, 
    iconBox: 
    { width: 40, 
      height: 40,
      borderRadius: 20, 
      justifyContent: 'center', 
      alignItems: 'center', 
    }, 
    content: 
    { flex: 1, 
      marginLeft: 10, 
    }, 
    title: 
    { fontWeight: 'bold', 
    }, 
    qty: 
    { color: '#6B7280', 
      marginTop: 2, 
    }, 
    date: 
    { fontSize: 12, 
      color: '#9CA3AF', 
      marginTop: 2, 
    }, 
    badge: 
    { paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 20, }, });