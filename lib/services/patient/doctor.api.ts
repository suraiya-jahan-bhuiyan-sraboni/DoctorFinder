import { API_BASE_URL } from "@/utils/api";
import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";;

export const doctorsApi = createApi({
    reducerPath: "doctorsApi",
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
        getDoctors: builder.query({
            query: ({ page = 1, limit, search = "", specialization = "" }) =>
                `/doctors?page=${page}&limit=${limit}&search=${search}&specialization=${specialization}`,
            providesTags: ['Appointments'],
        }),

    }),
});

export const { useGetDoctorsQuery } = doctorsApi;
