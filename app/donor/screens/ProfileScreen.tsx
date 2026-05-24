import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../../services/api";
import {
  Modal,
  TextInput,
} from "react-native";

type User = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] =
  useState(false);

const [editedName, setEditedName] =
  useState("");

const [editedEmail, setEditedEmail] =
  useState("");

const [phone, setPhone] =
  useState("Not Added");

const [location, setLocation] =
  useState("Not Added");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
        setEditedName(res.data.name || "");
setEditedEmail(res.data.email || "");
setPhone(res.data.phone || "");
setLocation(res.data.location || "");
      } catch (err: any) {
        console.log("PROFILE ERROR:", err?.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (e) {
      console.log('Logout error:', e);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {/* ✅ Dynamic initial */}
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>
        </View>

        {/* ✅ Dynamic name */}
        <Text style={styles.name}>
          {user?.name || "Loading..."}
        </Text>

        {/* ✅ Dynamic role */}
        <Text style={styles.role}>
          {user?.role || "User"}
        </Text>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        {/* ✅ Dynamic email */}
        <InfoRow
          icon="mail"
          title="Email"
          value={user?.email || "Loading..."}
        />

        {/* (Keep these static if not in backend yet) */}
        <InfoRow
  icon="call"
  title="Phone"
  value={phone || "Not Added"}
/>
        <InfoRow
  icon="location"
  title="Address"
  value={location || "Not Added"}
/>
      </View>

      {/* IMPACT (unchanged) */}
      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact</Text>

        <View style={styles.impactRow}>
          <ImpactItem value="0" label="Meals" />
          <ImpactItem value="0kg" label="Food Saved" />
          <ImpactItem value="0" label="People" />
        </View>
      </View>

      {/* BADGES (unchanged) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>

        <View style={styles.badgesRow}>
          <Badge emoji="🌟" />
          <Badge emoji="🏆" />
          <Badge emoji="💚" />
          <Badge emoji="🎯" />
          <Badge emoji="👑" />
        </View>
      </View>

{/* EDIT PROFILE */}
        <TouchableOpacity
  style={styles.editBtn}
  onPress={() => setShowEditModal(true)}
>
  <Ionicons
    name="create-outline"
    size={18}
    color="#F58634"
  />

  <Text style={styles.editBtnText}>
    Edit Profile
  </Text>
</TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <MaterialIcons name="logout" size={18} color="red" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    <Modal
  visible={showEditModal}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>

      <Text style={styles.modalTitle}>
        Edit Profile
      </Text>

      {/* NAME */}
      <Text style={styles.inputLabel}>
        Name
      </Text>

      <TextInput
        style={styles.modalInput}
        value={editedName}
        onChangeText={setEditedName}
        placeholder="Enter name"
      />

      {/* EMAIL */}
      <Text style={styles.inputLabel}>
        Email
      </Text>

      <TextInput
        style={styles.modalInput}
        value={editedEmail}
        onChangeText={setEditedEmail}
        placeholder="Enter email"
      />

      {/* PHONE */}
      <Text style={styles.inputLabel}>
        Phone
      </Text>

      <TextInput
        style={styles.modalInput}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone"
      />

      {/* ADDRESS */}
      <Text style={styles.inputLabel}>
        Address
      </Text>

      <TextInput
        style={styles.modalInput}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter address"
      />

      {/* BUTTONS */}
      <View style={styles.modalBtns}>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() =>
            setShowEditModal(false)
          }
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.saveBtn}
  onPress={async () => {
    try {

      const res = await API.put(
        "/auth/update-profile",
        {
          name: editedName,
          email: editedEmail,
          phone,
          address: location,
        }
      );

      setUser(res.data.user);

      setShowEditModal(false);

    } catch (err) {
      console.log(err);
    }
  }}
>
          <Text style={styles.saveText}>
            Save
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  </View>
</Modal>
    </ScrollView>
  );
}

/* 🔹 Components */

function InfoRow({ icon, title, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={16} color="#2ECC71" />
      </View>

      <View>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ImpactItem({ value, label }: any) {
  return (
    <View style={styles.impactItem}>
      <Text style={styles.impactValue}>{value}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

function Badge({ emoji }: any) {
  return (
    <View style={styles.badge}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    </View>
  );
}

/* 🎨 Styles — EXACT SAME */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F58634',
    padding: 6,
    borderRadius: 20,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    color: 'white',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontWeight: '500',
  },
  impactCard: {
    backgroundColor: '#2ECC71',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
  },
  impactTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  impactLabel: {
    color: 'white',
    fontSize: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },

  logout: {
  margin: 16,
  borderWidth: 1,
  borderColor: '#EF4444',
  padding: 14,
  borderRadius: 12,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  editBtn: {
  margin: 16,
  borderWidth: 1,
  borderColor: "#F58634",
  padding: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

editBtnText: {
  color: "#F58634",
  fontWeight: "bold",
  marginLeft: 8,
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  padding: 20,
},

modalContainer: {
  backgroundColor: "white",
  borderRadius: 24,
  padding: 20,
},

modalTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
  textAlign: "center",
},

inputLabel: {
  marginBottom: 6,
  marginTop: 10,
  fontWeight: "600",
},

modalInput: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  padding: 14,
  backgroundColor: "#F9FAFB",
},

modalBtns: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

cancelBtn: {
  flex: 1,
  marginRight: 10,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  padding: 14,
  borderRadius: 14,
  alignItems: "center",
},

saveBtn: {
  flex: 1,
  backgroundColor: "#2ECC71",
  padding: 14,
  borderRadius: 14,
  alignItems: "center",
},

cancelText: {
  fontWeight: "bold",
},

saveText: {
  color: "white",
  fontWeight: "bold",
},
});