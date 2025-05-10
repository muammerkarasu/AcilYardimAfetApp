import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Start, Login, ForgotPassword, Register, Home, Profile} from '../screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HelpRequests from '../screens/HelpRequests';
import HelpMap from '../screens/HelpMap';
import Donations from '../screens/Donations';
import CreateHelpRequest from '../screens/CreateHelpRequest';
import HelpRequestDetail from '../screens/HelpRequestDetail';
import CreateDonation from '../screens/CreateDonation';
import DonationDetail from '../screens/DonationDetail';
import VolunteerRegister from '../screens/VolunteerRegister';
import VolunteerDashboard from '../screens/VolunteerDashboard';
import {RoutesNames} from '../config';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e3c72',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({color, size, focused}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'HelpRequests') {
            iconName = 'alert-circle';
          } else if (route.name === 'HelpMap') {
            iconName = 'map-marker';
          } else if (route.name === 'Donations') {
            iconName = 'gift';
          } else if (route.name === 'ProfileTab') {
            iconName = 'account';
          } else if (route.name === 'VolunteerTab') {
            iconName = 'hand-heart';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Ana Sayfa',
        }}
      />
      <Tab.Screen
        name="HelpRequests"
        component={HelpRequests}
        options={{
          tabBarLabel: 'Yardım Çağrıları',
        }}
      />
      <Tab.Screen
        name="HelpMap"
        component={HelpMap}
        options={{
          tabBarLabel: 'Harita',
        }}
      />
      <Tab.Screen
        name="Donations"
        component={Donations}
        options={{
          tabBarLabel: 'Bağışlar',
        }}
      />
      <Tab.Screen
        name="VolunteerTab"
        component={VolunteerDashboard}
        options={{
          tabBarLabel: 'Gönüllü',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const StackRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name={RoutesNames.TAB_SCREEN} component={TabNavigator} />
      <Stack.Screen name="CreateHelpRequest" component={CreateHelpRequest} />
      <Stack.Screen name="HelpRequestDetail" component={HelpRequestDetail} />
      <Stack.Screen name="CreateDonation" component={CreateDonation} />
      <Stack.Screen name="DonationDetail" component={DonationDetail} />
      <Stack.Screen name="VolunteerRegister" component={VolunteerRegister} />
      <Stack.Screen name="VolunteerDashboard" component={VolunteerDashboard} />
    </Stack.Navigator>
  );
};

export default StackRoutes;