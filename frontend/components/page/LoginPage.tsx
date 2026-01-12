import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apiClient from '@/components/service/api'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "expo-router/build/global-state/routing";

export default function LoginPage(){
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async() =>{
        if (!email || !password) {
            Alert.alert("Error", "Les champs email et mot de passe doivent etre remplis.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiClient.post('/api/login_check', {
                email,
                password
            })

            const {token } = response.data;
            await AsyncStorage.setItem('token', token);
            console.log('Connexion réussi !');
            
        } catch ({error}: any) {
            const message = "Une erreur est survenue lors de la connexion.";
            Alert.alert("Erreur", message);
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <View style={{backgroundColor: '#fff'}}>
            <Text>Connexion</Text>
            <TextInput 
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 12,
                    marginBottom: 15,
                    borderRadius: 5,
                }}
            />
            <TextInput 
                placeholder="mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 12,
                    marginBottom: 15,
                    borderRadius: 5,
                }}
            />
            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{
                    backgroundColor: '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
            >
                <Text 
                style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigate('/register');
                }}
                style={{ marginTop: 20, alignItems: 'center' }}
            >
                <Text style={{ color: '#007AFF', fontSize: 16 }}>
                    Pas de compte ? Inscrivez-vous
                </Text>
            </TouchableOpacity>
        </View>
    )
}

