import { useEffect, useReducer, useCallback } from "react";
import axios from 'axios';
import reducer from "reducers/application";
const url = process.env.REACT_APP_WEBSOCKET_URL;

export default function Application(props) {

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

  //// OBJECT REDUCER

  // function reducer(state, action) {

  //   const { day, days, appointments, interviewers } = action;

  //   const reducers = {
  //     SET_DAY() {return {...state, day}},
  //     SET_APPLICATION_DATA() {return {...state, days, appointments, interviewers}},
  //     SET_INTERVIEW() {return {...state, appointments}},
  //     UPDATE_SPOTS() {return {...state, days}}  
  //   }

  //   if (!reducers[action.type]) throw new Error(`Tried to reduce with unspoorted action type: ${action.type}`);
    
  //   return reducers[action.type](state, action);
  // }

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const updateSpots = useCallback(function(id, value = 0) {
    let dayIndex;
    state.days.forEach((day, index) => {
      if (day.appointments.includes(id)) dayIndex = index;
    });
    
    const appointmentArray = state.days[dayIndex].appointments;
    const updatedSpots = appointmentArray.reduce((prev, curr) => {
      return state.appointments[curr].interview === null ? prev + 1 : prev;
    }, 0) ;

    const days = state.days.map((day, index) => {
      if (index !== dayIndex) return day;
      return {...day, spots: updatedSpots + value};
    });

    return days;
  }, [state]);

  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      dispatch({ type: 'SET_APPLICATION_DATA', days: [...all[0].data], appointments: {...all[1].data}, interviewers: {...all[2].data}});
    });

  }, []);

  useEffect(() => {

    const socket = new WebSocket(url);
    socket.onmessage = function (event) {
      const appointment = JSON.parse(event.data);
      const value = appointment.interview ? (state.appointments[appointment.id].interview ? 0 : -1) : 1;
      const days = updateSpots(appointment.id, value)
      if (appointment.type === 'SET_INTERVIEW') {
        dispatch( { type: appointment.type, appointments: {...state.appointments, [appointment.id]: { ...state.appointments[appointment.id],  ...appointment }}, days })
      }
    }

    return function cleanup() {
      if (socket.readyState === 1) socket.close();
    }
  }, [state, updateSpots])


  const setDay = day => dispatch({ type: 'SET_DAY', day});

  //// updateSpots function as per instructions (aka. not DRY)



  // function updateSpots(id, value = 0) {
  //   let dayIndex;
  //   state.days.forEach((day, index) => {
  //     if (day.appointments.includes(id)) dayIndex = index;
  //   });
    
  //   const appointmentArray = state.days[dayIndex].appointments;
  //   const updatedSpots = appointmentArray.reduce((prev, curr) => {
  //     return state.appointments[curr].interview === null ? prev + 1 : prev;
  //   }, 0) ;

  //   const days = state.days.map((day, index) => {
  //     if (index !== dayIndex) return day;
  //     return {...day, spots: updatedSpots + value};
  //   });

  //   return days;
  // }

  //// updateSPots function - DRY version

  // function updateSpots(id, value = 0) {
  //   let dayIndex;
  //   state.days.forEach((day, index) => {
  //     if (day.appointments.includes(id)) dayIndex = index;
  //   });
    
  //   const days = state.days.map((day, index) => {
  //     if (index !== dayIndex) return day;
  //     return {...day, spots: updatedSpots + value};
  //   });

  //   return days;
  // }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = !state.appointments[id].interview ? updateSpots(id, -1) : updateSpots(id);

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        dispatch({ type: 'SET_INTERVIEW', appointments, days});
      });

  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, 1);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: 'SET_INTERVIEW', appointments, days});
      });

  }
  return { state, setDay, bookInterview, cancelInterview };
}