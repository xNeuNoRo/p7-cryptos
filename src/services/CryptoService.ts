import {
  CryptoCurrenciesSchema,
  CryptoPriceSchema,
  CurrencyExchangeSchema,
} from "../schemas/crytoSchema";
import axios from "axios";
import type { PairType } from "../types";
import { exchangeCurrencies } from "../data";

export async function getCryptos() {
  const url =
    "https://data-api.coindesk.com/asset/v1/top/list?page=1&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,TOPLIST_RANK&toplist_quote_asset=USD&page_size=20";
  const {
    data: {
      Data: { LIST },
    },
  } = await axios(url);
  const result = CryptoCurrenciesSchema.safeParse(LIST);
  if (result.success) return result.data;
}

export async function getCurrenciesExchange() {
  console.log("se ejecuta getCurrenciesExchange(");
  const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  const { data } = await axios(url);
  const result = CurrencyExchangeSchema.safeParse(data);
  if (result.success) return result.data;
}

export async function fetchCurrentCryptoPrice(pair: PairType) {
  // Si la moneda es una que se convertira
  const isExchangeCurrency = exchangeCurrencies.some(
    (c) => c.code === pair.currency
  );
  const currencyToFetch = isExchangeCurrency ? "USD" : pair.currency;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.criptocurrency}&tsyms=${currencyToFetch}`;
  const {
    data: { RAW },
  } = await axios(url);
  const result = CryptoPriceSchema.safeParse(
    RAW[pair.criptocurrency][currencyToFetch]
  );
  if (result.success) return result.data;
}

export function convertCurrency(exchangeValue: number, USD: number): number {
  return exchangeValue * USD;
}
