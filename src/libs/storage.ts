import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface PlantProps{
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    },
    dateTimeNotification: Date;
}

interface StoragePlantProps {
    // para passar o id dinamicamente
    [id: string]: {
        data: PlantProps;
    }
}

// retorno é void
export async function savePlant(plant: PlantProps) : Promise<void> {
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        // se tiver dada ele converte para string, se não vai para objeto vazio
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id] : {
                data: plant
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants',
        //estou convertendo o json para string, adicionando a velha e a nova
            JSON.stringify({
                ...newPlant,
                ...oldPlants
            }));
    }catch(error){
        // tratar o erro lá na outra tela
        throw new Error(error);
    }
}

export async function loadPlant() : Promise<PlantProps[]> {
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        // se tiver dada ele converte para string, se não vai para objeto vazio
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const plantsSorted = Object
        .keys(plants) 
        .map((plant) => {//irei pecorrer cada keys
            return {
                ...plants[plant].data,
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
            }
        })
        .sort((a, b) => //para eu descobrir qual desses itend é o menor
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
        );

        return plantsSorted;
    }catch(error){
        // tratar o erro lá na outra tela
        throw new Error(error);
    }
}