import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  currencies,
  exchangeCurrencies as exchangeCurrenciesData,
} from "../data";
import { useCryptoStore } from "../stores/cryptoStore";
import type { PairType } from "../types";
import ErrorMessage from "./ErrorMessage";
// import { fetchCurrentCryptoPrice } from "../services/CryptoService";

const initialState = {
  currency: "",
  criptocurrency: "",
};

export default function CryptoSearchForm() {
  const cryptoCurrencies = useCryptoStore((state) => state.cryptoCurrencies);
  const currenciesExchange = useCryptoStore(
    (state) => state.currenciesExchange
  );
  const exchangeCurrenciesNextUpdate = useCryptoStore(
    (state) => state.currenciesNextUpdate
  );
  const fetchData = useCryptoStore((state) => state.fetchData);
  const fetchExchangeCurrency = useCryptoStore(
    (state) => state.fetchExchangeCurrency
  );
  const [pair, setPair] = useState<PairType>(initialState);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPair({ ...pair, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(pair).includes("")) {
      setError("Todos los campos son obligatorios!");
      return;
    }
    if (error) setError("");

    // Si es una moneda a convertir y esta en 0
    // o si su fecha a actualizar es el dia de hoy
    if (
      (exchangeCurrenciesData.some((c) => c.code === pair.currency) &&
        Object.values(currenciesExchange).includes(0)) ||
      new Date(exchangeCurrenciesNextUpdate).getUTCDay() ===
        new Date().getUTCDay()
    )
      fetchExchangeCurrency();

    fetchData(pair);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="field">
        <label htmlFor="currency">Moneda:</label>
        <select
          name="currency"
          id="currency"
          value={pair.currency}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {[...currencies, ...exchangeCurrenciesData].map((c) => (
            <option key={c.name} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="criptocurrency">Moneda:</label>
        <select
          name="criptocurrency"
          id="criptocurrency"
          value={pair.criptocurrency}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {cryptoCurrencies.map((crypto) => (
            <option key={crypto.SYMBOL} value={crypto.SYMBOL}>
              {crypto.NAME}
            </option>
          ))}
        </select>
      </div>

      <input type="submit" value="Cotizar" />
    </form>
  );
}
