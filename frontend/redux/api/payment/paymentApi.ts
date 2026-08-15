import { baseApi } from "../baseApi";
import {
  GetUserTransactionsResponse,
  Transaction,
  TransactionMeta,
} from "@/types/transaction.types";

interface CreatePaymentIntentRequest {
  bookingId: string;
}

interface CreatePaymentIntentResponse {
  success: boolean;
  data: {
    paymentIntentId: string;
    clientSecret: string;
  };
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      CreatePaymentIntentResponse,
      CreatePaymentIntentRequest
    >({
      query: (body) => ({
        url: "/payment/stripe/create-payment-intent",
        method: "POST",
        body,
      }),
      // Do NOT invalidate here — payment intent is created before payment completes.
      // Exhibition/Booking tags are invalidated in PaymentForm after Stripe success.
    }),
    getUserTransactions: builder.query<
      GetUserTransactionsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 8 } = {}) => ({
        url: "/transaction",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Booking"],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (_currentCache, newItems) => {
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.limit !== previousArg?.limit
        );
      },
    }),
    getAllTransactions: builder.query<
      {
        success: boolean;
        message: string;
        data: Transaction[];
        metaData: TransactionMeta;
      },
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status, page = 1, limit = 8 } = {}) => ({
        url: "/admin/transaction",
        method: "GET",
        params: { ...(status && status !== "all" ? { status } : {}), page, limit },
      }),
      providesTags: ["Booking"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePaymentIntentMutation,
  useGetUserTransactionsQuery,
  useGetAllTransactionsQuery,
} = paymentApi;
