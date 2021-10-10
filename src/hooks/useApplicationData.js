// import { useState, useEffect } from "react";
// import axios from 'axios';

// export default function Application(props) {
//   const [state, setState] = useState({
//     day: 'Monday',
//     days: [],
//     appointments: {},
//     interviewers: {}
//   });

//   const setDay = day => setState(prev => Object.assign({}, prev, { day }));

//   useEffect(() => {
//     Promise.all([
//       axios.get('/api/days'),
//       axios.get('/api/appointments'),
//       axios.get('/api/interviewers')
//     ]).then(all => {
//       setState(prev => ({...prev, 'days': [...all[0].data], 'appointments': {...all[1].data}, 'interviewers': {...all[2].data}}));
//     })
//   }, []);

//   function updateSpots(id, value = 0) {
//     let dayIndex;
//     state.days.forEach((day, index) => {
//       if (day.appointments.includes(id)) dayIndex = index;
//     });
    
//     const days = state.days.map((day, index) => {
//       if (index !== dayIndex) return day;
//       return {...day, spots: state.days[dayIndex].spots + value};
//     });

//     return days;
//   }

//   function bookInterview(id, interview) {
//     const appointment = {
//       ...state.appointments[id],
//       interview: { ...interview }
//     };
//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     };

//     const days = !state.appointments[id].interview ? updateSpots(id, -1) : updateSpots(id);

//     return axios.put(`/api/appointments/${id}`, {interview})
//       .then(() => setState(prev => ({...prev, appointments, days})));
//   }

//   function cancelInterview(id) {
//     const appointment = {
//       ...state.appointments[id],
//       interview: null
//     };
//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     };

//     const days = updateSpots(id, 1);

//     return axios.delete(`/api/appointments/${id}`)
//       .then(() => setState(prev => ({...prev, appointments, days})));

//   }
//   return { state, setDay, bookInterview, cancelInterview };
// }