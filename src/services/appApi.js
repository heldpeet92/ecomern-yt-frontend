import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

//create the api

export const appApi = createApi({
    reducerPath: 'appApi', // redux name for api
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080'}), //path to Node.js
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (user) => ({
                url: '/users/signup',
                method: 'POST',
                body: user
            })
        }),

        login: builder.mutation({
            query:(user) => ({
                url: '/users/login',
                method: 'POST',
                body: user
            })
        }),
        // creating product
        createProduct: builder.mutation({
            query:(product) => ({
                url: '/products',
                method: 'POST',
                body: product
            })
        }),
    }),
})

export const {useSignupMutation, useLoginMutation, useCreateProductMutation} = appApi

export default appApi;