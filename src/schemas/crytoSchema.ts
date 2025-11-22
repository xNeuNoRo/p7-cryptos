import { z } from "zod";
import { exchangeCurrencies } from "../data";

export const CurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const CryptoCurrencySchema = z.object({
  NAME: z.string(),
  SYMBOL: z.string(),
});

export const CryptoCurrenciesSchema = z.array(CryptoCurrencySchema);

export const PairSchema = z.object({
  currency: z.string(),
  criptocurrency: z.string(),
});

// Mapea cada objeto del array exchangeCurrencies en un array de tipo ["clave", "valor"]
// Para luego convertir dicho array en un objeto con el metodo Object.fromEntries()
export const CurrenciesExchangeValuesSchema = z.object(
  Object.fromEntries(exchangeCurrencies.map((c) => [c.code, z.number()]))
);

export const CurrencyExchangeSchema = z.object({
  time_next_update_utc: z.coerce.date(),
  conversion_rates: CurrenciesExchangeValuesSchema,
});

export const CryptoPriceSchema = z.object({
  IMAGEURL: z.string(),
  PRICE: z.number(),
  HIGHDAY: z.number(),
  LOWDAY: z.number(),
  CHANGEPCT24HOUR: z.number(),
  LASTUPDATE: z.number(),
});
