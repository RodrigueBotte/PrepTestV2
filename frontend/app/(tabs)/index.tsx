import LoginPage from '@/components/page/LoginPage';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginPage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});
