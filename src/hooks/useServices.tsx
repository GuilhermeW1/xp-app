// import { useCallback, useEffect, useReducer } from 'react';
// import type {Service} from '../types/service';
// import { addDoc, collection } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../firebaseConfig';

// interface ServiceList extends Service {
//   error: string | null;
// }

// type ActionType =
//   | {type: 'ADD', service: Omit<Service, 'id'>}
//   | {type: 'REMOVE', id: string}
//   | {type: 'UPDATE', service: Service};


// function reducer(state: Service[], action: ActionType){
//   switch(action.type) {
//   case 'ADD':
//     return state;
//   case 'REMOVE' :
//     return state;
//   case 'UPDATE' :
//     return state;
//   default :
//     throw new Error();
//   }
// }

// export function useService():{
//   services: Service[];
//   } {
//   const [services, dispatch] = useReducer(reducer, []);

//   useEffect(() => {
//     return;
//   }, []);

//   const addService = useCallback(async ({name, price, time}: Omit<Service, 'id'>) => {
//     if(!name || !price || !time){
//       return;
//     }

//     const service = {
//       nome: name,
//       valor: price,
//       tempo: time,
//     };
//     try{
//       const res = await addDoc(collection(FIREBASE_DB, 'Servicos'), service);
//     }catch(error){
//       throw new Error('Erro ao criar um servico');
//     }
//     // setService(null);
//   }, []);

//   return {services};
// }
