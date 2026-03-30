import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen    from './screens/HomeScreen';
import PairScreen    from './screens/PairScreen';
import ChannelScreen from './screens/ChannelScreen';
import TalkScreen    from './screens/TalkScreen';
import { theme } from './theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown:   false,
            cardStyle:     { backgroundColor: theme.bg },
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home"    component={HomeScreen}    />
          <Stack.Screen name="Pair"    component={PairScreen}    />
          <Stack.Screen name="Channel" component={ChannelScreen} />
          <Stack.Screen name="Talk"    component={TalkScreen}    />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}