export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT';

export const addAppointment = (appointment) => ({
  type: ADD_APPOINTMENT,
  payload: appointment,
});

export const deleteAppointment = (id) => ({
  type: DELETE_APPOINTMENT,
  payload: id,
});

export const updateAppointment = (id, changes) => ({
  type: UPDATE_APPOINTMENT,
  payload: { id, changes },
});