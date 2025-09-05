import { API_BASE_URL } from "@/utils/api";
import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Doctor {
    id: string;
    name: string;
    email: string;
    specialization: string;
    photo_url: string | null;
}

export interface DoctorAppointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    patient: Doctor;
}

export interface AppointmentResponse {
    data: DoctorAppointment[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const allDoctorAppointmentListsApi = createApi({
    reducerPath: "allDoctorAppointmentListsApi",
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
        getAllDoctorAppointmentLists: build.query<AppointmentResponse, { status?: string; page?: number; }>({
            query: ({ status="", page }) => `/appointments/patient?status=${status}&page=${page}`,
            providesTags: ['Appointments'],
        }),
        updateAppointmentStatus: build.mutation<void, { appointment_id: string; status:"CANCELLED" }>({
            query: ({ appointment_id, status }) => ({
                url: `/appointments/update-status`,
                method: "PATCH",
                body: { appointment_id, status },
            }),
            invalidatesTags: ['Appointments'],
        }),
    })
})

export const { useGetAllDoctorAppointmentListsQuery, useUpdateAppointmentStatusMutation } = allDoctorAppointmentListsApi;