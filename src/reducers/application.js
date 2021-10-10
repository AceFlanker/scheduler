//// OBJECT REDUCER

export default function reducer(state, action) {

  const { day, days, appointments, interviewers } = action;

  const reducers = {
    SET_DAY() {return {...state, day}},
    SET_APPLICATION_DATA() {return {...state, days, appointments, interviewers}},
    SET_INTERVIEW() {return {...state, appointments, days}}
  }

  if (!reducers[action.type]) throw new Error(`Tried to reduce with unsupported action type`);
  
  return reducers[action.type](state, action);

}

//// SWITCH/CASE REDUCER

// const SET_DAY = 'SET_DAY';
// const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
// const SET_INTERVIEW = 'SET_INTERVIEW';
// const UPDATE_SPOTS = 'UPDATE_SPOTS';

// function reducer(state, action) {

//   const { day, days, appointments, interviewers } = action;

//   switch (action.type) {
//     case SET_DAY:
//       return { ...state, day }
//     case SET_APPLICATION_DATA:
//       return { ...state, days, appointments, interviewers }
//     case SET_INTERVIEW:
//       return { ...state, appointments, days }
//     case UPDATE_SPOTS: {
//       return { ...state, days }
//     }
//     default:
//       throw new Error(
//         `Tried to reduce with unsupported action type: ${action.type}`
//       );
//   }
// }

