import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import DeviceFrame from './components/DeviceFrame';
import DashboardScreen from './components/DashboardScreen';
import CollabsScreen from './components/CollabsScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import ContentScreen from './components/ContentScreen';
import SettingsScreen from './components/SettingsScreen';

function MainApp() {
  const { activeScreen } = useContext(AppContext);

  return (
    <DeviceFrame>
      {activeScreen === 'dashboard' && <DashboardScreen />}
      {activeScreen === 'collabs' && <CollabsScreen />}
      {activeScreen === 'analytics' && <AnalyticsScreen />}
      {activeScreen === 'content' && <ContentScreen />}
      {activeScreen === 'settings' && <SettingsScreen />}
    </DeviceFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
