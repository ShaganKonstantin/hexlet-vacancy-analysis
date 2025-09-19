import React, { useState, useMemo } from "react";
import { VacancyCard } from "../../../vacancy/index";
import type { RegionPageProps } from "../model/types";

export const RegionPage: React.FC<RegionPageProps> = ({ region, vacancies, dynamics, filters, filterOptions,links, query_params }) => {
  const [searchTerm, useSearchTerm] = useState(filters.search_query || '');
  const [selectedExp, setSelectedExp] = useState(filters.experience || null);
  const [selectedRegion, setSelectedRegion] = useState(filters.region || '');

  const { growthPercentage, chartData, currentCount } = useMemo(() => {
    if (!dynamics || dynamics.length < 2) {
      return {
        growthPercentage: 0,
        chartData: [],
        currentCount: 0
      };
    }

    const currentData = dynamics[dynamics.length - 1];
    const startData = dynamics[0];
    const calculateGrowth = ((currentData.count - startData.count) / startData.count) * 100;
    // Оругляем результат, чтобы было 1 значение после запятой и нормально читалось.
    const roundedGrowth = calculateGrowth.toFixed(1);

    const preparedChartData = dynamics.map((item) => {
      return {
        count: item.count,
        month: item.month,
        year: item.year
      }
    });

    return {
      growthPercentage: roundedGrowth,
      chartData: preparedChartData,
      currentCount: currentData.count
    }
  }, [dynamics])

  return (
    <div>boobs</div>
  )
}




