import { z } from "zod";
import {
  CryptoCurrencySchema,
  CryptoPriceSchema,
  CurrenciesExchangeValuesSchema,
  CurrencySchema,
  PairSchema,
} from "../schemas/crytoSchema";

export type Currency = z.infer<typeof CurrencySchema>;
export type CryptoCurrency = z.infer<typeof CryptoCurrencySchema>;
export type PairType = z.infer<typeof PairSchema>;
export type exchangeCurrencies = z.infer<typeof CurrenciesExchangeValuesSchema>;
export type CryptoPrice = z.infer<typeof CryptoPriceSchema>;
