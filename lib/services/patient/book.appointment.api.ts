import { API_BASE_URL } from "@/utils/api";
import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentsApi = createApi({
    reducerPath: "appointmentsApi",
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
    tagTypes: ["Appointments"],
    endpoints: (builder) => ({
        createAppointment: builder.mutation({
            query: (body) => ({
                url: "/appointments",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Appointments"],
        }),
    }),
});

export const { useCreateAppointmentMutation } = appointmentsApi;
