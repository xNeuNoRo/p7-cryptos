import { useMemo } from "react";
import { useCryptoStore } from "../stores/cryptoStore";
import { exchangeCurrencies } from "../data";
import { convertCurrency } from "../services/CryptoService";
import Spinner from "./Spinner";

export default function CryptoPriceDisplay() {
  const cryptoResult = useCryptoStore((state) => state.cryptoResult);
  const currencySelected = useCryptoStore((state) => state.currencySelected);
  const currenciesToConvert = useCryptoStore(
    (state) => state.currenciesExchange
  );
  const loading = useCryptoStore((state) => state.loading);

  const hasResult = useMemo(
    () => Object.keys(cryptoResult).length > 0,
    [cryptoResult]
  );
  const isExchangeCurrency = exchangeCurrencies.some(
    (c) => c.code === currencySelected
  );
  const exchangeVal = currenciesToConvert[currencySelected] ?? 0;

  const cryptoDate = new Date(cryptoResult.LASTUPDATE * 1000);
  const cryptoDateFormatted = cryptoDate.toLocaleDateString("es-ES", {
    weekday: "long", // día de la semana
    day: "numeric", // día del mes
    month: "long", // mes completo
    year: "numeric", // año completo
  });

  return (
    <div className="result-wrapper">
      {loading ? (
        <Spinner />
      ) : (
        hasResult && (
          <>
            <h2>Cotizacion</h2>
            <div className="result">
              <img
                src={`https://cryptocompare.com/${cryptoResult.IMAGEURL}`}
                alt="Imagen de una criptomoneda"
              />
              <div>
                <p>
                  El precio es de:{" "}
                  <span>
                    {isExchangeCurrency
                      ? `${currencySelected}$ ${convertCurrency(
                          exchangeVal,
                          cryptoResult.PRICE
                        ).toLocaleString()}`
                      : `${currencySelected}$ ${cryptoResult.PRICE.toLocaleString()}`}
                  </span>
                </p>
                <p>
                  Precio mas alto del dia:{" "}
                  <span>
                    {isExchangeCurrency
                      ? `${currencySelected}$ ${convertCurrency(
                          exchangeVal,
                          cryptoResult.HIGHDAY
                        ).toLocaleString()}`
                      : `${currencySelected}$ ${cryptoResult.HIGHDAY.toLocaleString()}`}
                  </span>
                </p>
                <p>
                  Precio mas bajo del dia:{" "}
                  <span>
                    {isExchangeCurrency
                      ? `${currencySelected}$ ${convertCurrency(
                          exchangeVal,
                          cryptoResult.LOWDAY
                        ).toLocaleString()}`
                      : `${currencySelected}$ ${cryptoResult.LOWDAY.toLocaleString()}`}
                  </span>
                </p>
                <p>
                  Variacion ultimas 24 horas:{" "}
                  <span>
                    {isExchangeCurrency
                      ? convertCurrency(
                          exchangeVal,
                          cryptoResult.CHANGEPCT24HOUR
                        ).toLocaleString()
                      : cryptoResult.CHANGEPCT24HOUR.toLocaleString()}
                  </span>
                </p>
                <p>
                  Ultima actualizacion: <span>{cryptoDateFormatted}</span>
                </p>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
