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

            const { token } = response.data;
            await AsyncStorage.setItem('jwt_token', token);
            console.log('Connexion réussi !');
            navigate('/(tabs)/calendar');
            
        } catch ({error}: any) {
            const message = "Une erreur est survenue lors de la connexion.";
            Alert.alert("Erreur", message);
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput 
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                style={styles.inputStyle}
            />
            <TextInput 
                placeholder="mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.inputStyle}
            />
            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={styles.btnStyle}
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

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
        padding: 40,
        justifyContent: 'center',
        gap: 25
    },
    inputStyle:{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
    },
    title:{
        fontSize: 24,
        textAlign: 'center',
    },
    btnStyle:{
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    }
})