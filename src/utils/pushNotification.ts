import messaging from '@react-native-firebase/messaging';
import { getDataStorage, setDataStorage } from './asyncStorage';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFirebaseCloudMessagingToken();
  }
};

const getFirebaseCloudMessagingToken = async () => {
  const fcmToken = await getDataStorage('fcmToken');
  console.log(fcmToken, 'old token');

  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'new token');
        await setDataStorage('fcmToken', fcmToken);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on froground state...', remoteMessage);
  });
};