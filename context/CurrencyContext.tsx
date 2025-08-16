import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  apiCode: string;
}

export const COUNTRIES: CountryCurrency[] = [
  { code: 'ARS', name: '', symbol: '$', flag: '🇦🇷', apiCode: 'ARS' },
  { code: 'CLP', name: 'CLP', symbol: '$', flag: '🇨🇱', apiCode: 'CLP' },
  { code: 'COP', name: 'COP', symbol: '$', flag: '🇨🇴', apiCode: 'COP' },
  { code: 'PEN', name: 'PEN', symbol: 'S/', flag: '🇵🇪', apiCode: 'PEN' },
  { code: 'UYU', name: 'UYU', symbol: '$', flag: '🇺🇾', apiCode: 'UYU' },
  { code: 'MXN', name: 'MXN', symbol: '$', flag: '🇲🇽', apiCode: 'MXN' },
  { code: 'BRL', name: 'BRL', symbol: 'R$', flag: '🇧🇷', apiCode: 'BRL' },
  { code: 'BOB', name: 'BOB', symbol: 'Bs', flag: '🇧🇴', apiCode: 'BOB' },
  { code: 'PYG', name: 'PYG', symbol: '₲', flag: '🇵🇾', apiCode: 'PYG' },
  { code: 'CRC', name: 'CRC', symbol: '₡', flag: '🇨🇷', apiCode: 'CRC' },
  { code: 'GTQ', name: 'GTQ', symbol: 'Q', flag: '🇬🇹', apiCode: 'GTQ' },
  { code: 'HNL', name: 'HNL', symbol: 'L', flag: '🇭🇳', apiCode: 'HNL' },
  { code: 'NIO', name: 'NIO', symbol: 'C$', flag: '🇳🇮', apiCode: 'NIO' },
  { code: 'DOP', name: 'DOP', symbol: 'RD$', flag: '🇩🇴', apiCode: 'DOP' },
  { code: 'CUP', name: 'CUP', symbol: '$', flag: '🇨🇺', apiCode: 'CUP' },
  { code: 'BSD', name: 'BSD', symbol: '$', flag: '🇧🇸', apiCode: 'BSD' },
  { code: 'BZD', name: 'BZD', symbol: 'BZ$', flag: '🇧🇿', apiCode: 'BZD' },
  { code: 'USD', name: 'USD', symbol: 'US$', flag: '🇺🇸', apiCode: 'USD' },
  { code: 'CAD', name: 'CAD', symbol: 'CA$', flag: '🇨🇦', apiCode: 'CAD' },
  { code: 'EUR', name: 'EUR', symbol: '€', flag: '🇪🇸', apiCode: 'EUR' },
];

interface CurrencyContextType {
  country: CountryCurrency;
  rate: number;
  setCountry: (country: CountryCurrency) => void;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        // Usar USD como base para conversion universal
        const res = await fetch(`https://api.exchangerate.host/latest?base=USD`);
        const data = await res.json();
        if (data && data.rates && data.rates[country.apiCode]) {
          setRate(data.rates[country.apiCode]);
        } else {
          setRate(1);
        }
      } catch {
        setRate(1);
      }
      setLoading(false);
    };
    fetchRate();
  }, [country]);

  return (
    <CurrencyContext.Provider value={{ country, rate, setCountry, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency debe usarse dentro de CurrencyProvider');
  return ctx;
};
