import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
    };
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    // para passar o id dinamicamente
    [id: string]: {
        data: PlantProps;
        notificationId: string;
    }
}

// retorno é void
export async function savePlant(plant: PlantProps) : Promise<void> {
    try{
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();

        const { times, repeat_every } = plant.frequency;
        if(repeat_every === 'week'){
            const interval = Math.trunc(7 / times);
            nextTime.setDate(now.getDate() + interval); //pega data de agora now.getDate()
        }else
            nextTime.setDate(nextTime.getDate() + 1)

        const seconds = Math.abs( //ter valor absoluto
            Math.ceil(now.getTime() - nextTime.getTime()) / 1000
        );

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heey, 🌱',
                body: `Está na hora de cidar da sua ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    plant
                },
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds, //se for menor do que 60 a gente agenda 60 ou se não, seconds
                repeats: true
            }
        })

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        // se tiver dada ele converte para string, se não vai para objeto vazio
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id] : {
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants',
        //estou convertendo o json para string, adicionando a velha e a nova
            JSON.stringify({
                ...newPlant,
                ...oldPlants
            }));
    } catch(error){
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

export async function removePlant(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

    delete plants[id];

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}