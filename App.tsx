import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { AuthProvider } from './src/context/authContext';
import { ThemeProvider } from './src/context/themeContext';
import { NotificationProvider } from './src/context/notificationContext';
import { ConnectProvider } from './src/context/connectContext';
import { toastConfig } from './src/utils/configToast';
import RecordStatus from './src/components/record/RecordStatus';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetworkStatus from './src/components/network/NetworkStatus';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FIREBASE } from './src/utils/firebaseMessaging';
import ApplicationVersion from './src/components/update/Version';
import PopupView from './src/components/webview/PopupView';
import CountStep from './src/components/countStep/CountStep';
import CodePush from './src/components/CodePush';

LogBox.ignoreLogs(["Battery state `unknown` and monitoring disabled, this is normal for simulators and tvOS"]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    }
  },
});

enableFreeze(true);
enableScreens(false);
const App: React.FC = () => {
  useEffect(() => {
    FIREBASE.initializeFirebaseMessaging()
  }, []);

  return (
    <GestureHandlerRootView key={"miniproject"} style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ConnectProvider>
                <QueryClientProvider client={queryClient}>
                  <CodePush />
                  <AppNavigator />
                  <Toast config={toastConfig} />
                  <RecordStatus />
                  <NetworkStatus />
                  <PopupView />
                  <CountStep />
                  <ApplicationVersion />
                </QueryClientProvider>
              </ConnectProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};
export default App;
