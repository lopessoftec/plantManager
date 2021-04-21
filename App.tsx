import React from 'react';
// para garantir enquanto as fontes é carregado
import AppLoading from 'expo-app-loading';

import Routes from './src/routes';

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

  if(!fontsLoaded){
    return <AppLoading />
  }
  return (
    <Routes />
  )
}