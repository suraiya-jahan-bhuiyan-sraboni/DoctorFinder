import { configureStore } from '@reduxjs/toolkit'
import CounterReducer from '../lib/features/counter/counterSlice'
import AuthReducer from '@/lib/features/login/authSlice'
import { allPatientAppointmentListsApi } from './services/doctor/patients.appointment.lists'
import { doctorsApi } from './services/patient/doctor.api'
import { appointmentsApi } from './services/patient/book.appointment.api'
import { allDoctorAppointmentListsApi } from './services/patient/doctors.appointment.lists'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: CounterReducer,
      auth: AuthReducer,
      [allPatientAppointmentListsApi.reducerPath]: allPatientAppointmentListsApi.reducer,
      [doctorsApi.reducerPath]: doctorsApi.reducer,
      [appointmentsApi.reducerPath]: appointmentsApi.reducer,
      [allDoctorAppointmentListsApi.reducerPath]: allDoctorAppointmentListsApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware()
        .concat(allPatientAppointmentListsApi.middleware)
        .concat(doctorsApi.middleware)
        .concat(appointmentsApi.middleware)
        .concat(allDoctorAppointmentListsApi.middleware)
    )
  })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']