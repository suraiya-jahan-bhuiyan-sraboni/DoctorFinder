import { API_BASE_URL } from "@/utils/api";
import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Patient {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
}

export interface PatientAppointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    patient: Patient;
}

export interface AppointmentResponse {
    data: PatientAppointment[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}



export const allPatientAppointmentListsApi = createApi({
    reducerPath: "allPatientAppointmentListsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Appointments'],
    endpoints: (build) => ({
        getAllPatientAppointmentLists: build.query<AppointmentResponse, { status?: string; date?: string; page?: number; }>({
            query: ({ status, date, page }) => `/appointments/doctor?status=${status}&date=${date}&page=${page}`,
             providesTags: ['Appointments'],
        }),
        updateAppointmentStatus: build.mutation<void,{ appointment_id: string; status: "COMPLETED" | "CANCELLED" }>({
            query: ({ appointment_id, status }) => ({
                url: `/appointments/update-status`,
                method: "PATCH",
                body: { appointment_id, status },
            }),
             invalidatesTags: ['Appointments'],
        }),
    })
})

export const { useGetAllPatientAppointmentListsQuery, useUpdateAppointmentStatusMutation } = allPatientAppointmentListsApi;