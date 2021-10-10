// export function getAppointmentsForDay(state, day) {
//   let dailyAppointments = [];
//   const appointmentArry = [];
//   state.days.forEach(weekday => {
//     if (weekday.name === day) {
//       dailyAppointments = [...weekday.appointments];
//     }
//   });
//   dailyAppointments.forEach(appointmentID => {
//     appointmentArry.push(state.appointments[appointmentID]);
//   })
//   return appointmentArry;
// };

export function getAppointmentsForDay(state, day) {
  const found = state.days.find(weekday => weekday.name === day);
  if (state.days.length === 0|| found === undefined) return [];
  return found.appointments.map(id => state.appointments[id]);
};

export function getInterview(state, interview) {
  if (!interview) return null;
  const interviewers = state.interviewers;
  const interviewerID = interview.interviewer;
  const interviewer = interviewers[interviewerID];
  return {...interview, interviewer };
};

// export function getInterviewersForDay(state, day) {
//   let dailyInterviewers = [];
//   const interviewerArray = [];
//   state.days.forEach(weekday => {
//     if (weekday.name === day) {
//       dailyInterviewers = [...weekday.interviewers];
//     }
//   });
//   dailyInterviewers.forEach(interviewerID => {
//     interviewerArray.push(state.interviewers[interviewerID]);
//   })
//   return interviewerArray;
// };

export function getInterviewersForDay(state, day) {
  const found = state.days.find(weekday => weekday.name === day);
  if (state.days.length === 0|| found === undefined) return [];
  return found.interviewers.map(id => state.interviewers[id]);
};