// PieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import { api_base, getLiveAccToken, getToken } from '@deriv/bot-skeleton';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type EvenOddPieProps = {
  allDigitList: number[];
  contract_type: string;
  isEvenOddOneClickActive: boolean;
  percentageValue: number | string;
  oneClickAmount: number | string;
  oneClickDuration: number;
  active_symbol: string;
  isTradeActive: boolean;
  isTradeActiveRef: React.MutableRefObject<boolean>;
  liveAccCR: string;
  enableCopyDemo: boolean;
  sameDiffEvenOdd: string;
  setIsTradeActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const PieChart: React.FC<EvenOddPieProps> = ({
  allDigitList,
  contract_type,
  isEvenOddOneClickActive,
  percentageValue,
  active_symbol,
  isTradeActiveRef,
  oneClickAmount,
  oneClickDuration,
  isTradeActive,
  enableCopyDemo,
  liveAccCR,
  sameDiffEvenOdd,
  setIsTradeActive,
}) => {

  const getContractType = (contract_type: string): string => {
    if (sameDiffEvenOdd === 'OPPOSITE') {
      return contract_type === 'DIGITEVEN' ? 'DIGITODD' : 'DIGITEVEN';
    } else {
      return contract_type;
    }
  };

  const buy_contract = () => {
    if (isEvenOddOneClickActive && !isTradeActive) {
      isTradeActiveRef.current = true;
      setIsTradeActive(true);
      !enableCopyDemo
        ? api_base.api.send({
            buy: '1',
            price: oneClickAmount,
            subscribe: 1,
            parameters: {
              amount: oneClickAmount,
              basis: 'stake',
              contract_type: getContractType(contract_type),
              currency: 'USD',
              duration: oneClickDuration,
              duration_unit: 't',
              symbol: active_symbol,
            },
          })
        : api_base.api.send({
            buy_contract_for_multiple_accounts: '1',
            tokens: [getToken().token, getLiveAccToken(liveAccCR).token],
            price: oneClickAmount,
            parameters: {
              amount: oneClickAmount,
              basis: 'stake',
              contract_type: getContractType(contract_type),
              currency: 'USD',
              duration: oneClickDuration,
              duration_unit: 't',
              symbol: active_symbol,
            },
          });
    }
  };

  const buy_contract2 = (contract_type: string) => {
    if (isEvenOddOneClickActive && !isTradeActive) {
      isTradeActiveRef.current = true;
      setIsTradeActive(true);
      !enableCopyDemo
        ? api_base.api.send({
            buy: '1',
            price: oneClickAmount,
            subscribe: 1,
            parameters: {
              amount: oneClickAmount,
              basis: 'stake',
              contract_type: getContractType(contract_type),
              currency: 'USD',
              duration: oneClickDuration,
              duration_unit: 't',
              symbol: active_symbol,
            },
          })
        : api_base.api.send({
            buy_contract_for_multiple_accounts: '1',
            tokens: [getToken().token, getLiveAccToken(liveAccCR).token],
            price: oneClickAmount,
            parameters: {
              amount: oneClickAmount,
              basis: 'stake',
              contract_type: getContractType(contract_type),
              currency: 'USD',
              duration: oneClickDuration,
              duration_unit: 't',
              symbol: active_symbol,
            },
          });
    }
  };

  const calculateOddEvenPercentages = (numbers: number[]): { oddPercentage: number; evenPercentage: number } => {
    let oddCount = 0;
    let evenCount = 0;
    const totalNumbers = numbers.length;

    numbers.forEach((number) => {
      if (number % 2 === 0) {
        evenCount++;
      } else {
        oddCount++;
      }
    });

    const oddPercentage = ((oddCount / totalNumbers) * 100).toFixed(2);
    const evenPercentage = ((evenCount / totalNumbers) * 100).toFixed(2);

    return {
      oddPercentage: parseFloat(oddPercentage),
      evenPercentage: parseFloat(evenPercentage),
    };
  };

  const percentages = calculateOddEvenPercentages(allDigitList);

  if (
    contract_type === 'DIGITEVEN' &&
    typeof percentageValue === 'number' &&
    percentages.evenPercentage >= percentageValue
  ) {
    buy_contract();
  } else if (
    contract_type === 'DIGITODD' &&
    typeof percentageValue === 'number' &&
    percentages.oddPercentage >= percentageValue
  ) {
    buy_contract();
  } else if (
    contract_type === 'BOTH' &&
    typeof percentageValue === 'number' &&
    percentages.oddPercentage >= percentageValue
  ) {
    buy_contract2('DIGITODD');
  } else if (
    contract_type === 'BOTH' &&
    typeof percentageValue === 'number' &&
    percentages.evenPercentage >= percentageValue
  ) {
    buy_contract2('DIGITEVEN');
  }

  const data: ChartData<'pie'> = {
    labels: ['Even', 'Odd'],
    datasets: [
      {
        data: [percentages.evenPercentage, percentages.oddPercentage],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
      datalabels: {
        formatter: (value, context) => {
          return `${value}%`;
        },
        color: '#fff',
      },
    },
  };

  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
