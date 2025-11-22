import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  CryptoCurrency,
  CryptoPrice,
  exchangeCurrencies,
  PairType,
} from "../types";
import {
  fetchCurrentCryptoPrice,
  getCryptos,
  getCurrenciesExchange,
} from "../services/CryptoService";

type CryptoStore = {
  currenciesNextUpdate: Date;
  currenciesExchange: exchangeCurrencies;
  cryptoCurrencies: CryptoCurrency[];
  cryptoResult: CryptoPrice;
  loading: boolean;
  currencySelected: keyof exchangeCurrencies;
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: PairType) => Promise<void>;
  fetchExchangeCurrency: () => Promise<void>;
};

export const useCryptoStore = create<CryptoStore>()(
  devtools(
    persist(
      (set) => ({
        currenciesNextUpdate: new Date(),
        currenciesExchange: { DOP: 0 },
        cryptoCurrencies: [],
        cryptoResult: {} as CryptoPrice,
        loading: false,
        currencySelected: "" as keyof exchangeCurrencies,
        fetchCryptos: async () => {
          const cryptoCurrencies = await getCryptos();
          set(() => ({ cryptoCurrencies }));
        },
        fetchData: async (pair) => {
          set(() => ({ loading: true }));
          const cryptoResult = await fetchCurrentCryptoPrice(pair);
          set(() => ({
            cryptoResult,
            loading: false,
            currencySelected: pair.currency as keyof exchangeCurrencies,
          }));
        },
        fetchExchangeCurrency: async () => {
          const exchangeCurrencies = await getCurrenciesExchange();
          set(() => ({
            currenciesNextUpdate: exchangeCurrencies?.time_next_update_utc,
            currenciesExchange: exchangeCurrencies?.conversion_rates,
          }));
        },
      }),
      {
        name: "cryptoStorage",
        partialize: (state) => ({
          currenciesNextUpdate: state.currenciesNextUpdate,
          currenciesExchange: state.currenciesExchange,
        }),
      }
    )
  )
);
