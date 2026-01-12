import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apiClient from "../service/api";
import { navigate } from "expo-router/build/global-state/routing";

export default function RegisterPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading]= useState(false);

    const handleRegister = async() =>{
        if (!email || !password || !confirmPassword){
            return Alert.alert("Erreur", "tous les champs doivent être remplis")
        }
        if (password !== confirmPassword ){
            return Alert.alert("Erreur", "Les mots de passes ne correspondent pas.")
        }
        setLoading( true);
        try {
            const response = await apiClient.post('/api/register', {
                email, 
                password
            })
            console.log('Inscription réussie');
            navigate('/');
        } catch (error) {
            const message = "Une erreur est survenue lors de l'incription";
            Alert.alert("Erreur", message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <View style={{backgroundColor: '#fff'}}>
            <Text>Inscription</Text>
            <TextInput 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.inputStyle}
            />
            <TextInput 
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputStyle}
            />
            <TextInput 
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.inputStyle}
            />
            <TouchableOpacity onPress={handleRegister}>
                <Text>
                    {loading? "Inscription...": "S'inscrire"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputStyle:{
        padding: 10,
        borderWidth: 1,
        borderColor: '#205dce',
        borderRadius: 10,
    }
})