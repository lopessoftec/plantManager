import React, { useEffect } from 'react';
// para garantir enquanto as fontes é carregado
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import { PlantProps } from './src/libs/storage';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'

export default function App(){
  // o retorno da primeiro indice do array irei colocar em fontsLoaded
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      }
    );

    return () => subscription.remove();

    //==============================================================================
    
    //posso também capturar todos os agendamentos

    // async function notifications(){
    //   // const data = await Notifications.getAllScheduledNotificationsAsync();
    //   // console.log("######### NOTIFICAÇÕES AGENDADAS #########")
    //   // console.log(data);

    //   // await Notifications.cancelAllScheduledNotificationsAsync();
    // }

    // notifications();

    //==============================================================================
  }, [])

  if(!fontsLoaded){
    return <AppLoading />
  }
  return (
    <Routes />
  )
}