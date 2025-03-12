import React, { useEffect, useState } from 'react';

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.vatcomply.com/rates');
        const data = await response.json();
        setRates(data.rates);
        setDate(data.date);
        const initialTargetRate = data.rates[targetCurrency];
        setConvertedAmount(amount * initialTargetRate);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates[baseCurrency] && rates[targetCurrency]) {
      const baseRate = rates[baseCurrency];
      const targetRate = rates[targetCurrency];
      setConvertedAmount((amount * targetRate) / baseRate);
    }
  }, [amount, baseCurrency, targetCurrency, rates]);

  const handleBaseChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  const handleTargetChange = (e) => {
    setTargetCurrency(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b-2 border-gray-200 pb-4">
          💱 Hitung Nilai Tukar
        </h1>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Nilai tukar
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-lg 
                        focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                        transition-all duration-200 outline-none"
              placeholder="Enter amount"
              min="0"
            />
          </div>

          {/* Currency Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Asal MataUang
              </label>
              <select
                value={baseCurrency}
                onChange={handleBaseChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 
                          rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                          transition-all duration-200 cursor-pointer outline-none"
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Matauang Tujuan
              </label>
              <select
                value={targetCurrency}
                onChange={handleTargetChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 
                          rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                          transition-all duration-200 cursor-pointer outline-none"
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversion Results */}
          <div className="mt-8 p-6 bg-blue-50/30 rounded-xl border-2 border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hasil</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Nilai Asli:</span>
                <span className="text-gray-900 font-semibold">
                  {amount} {baseCurrency}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Nilai Setelah Tukar:</span>
                <span className="text-blue-800 font-bold text-lg">
                  {convertedAmount.toFixed(2)} {targetCurrency}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                <span className="text-gray-700 text-sm">Exchange Rate Date:</span>
                <span className="text-gray-700 text-sm font-medium">{date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;