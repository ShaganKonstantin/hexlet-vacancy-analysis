import React, { useState, useMemo } from "react";
import { VacancyCard } from "../../../vacancy/index";
import type { RegionPageProps } from "../model/types";

export const RegionPage: React.FC<RegionPageProps> = ({ region, vacancies, dynamics, filters, filterOptions,links, query_params }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search_query || '');
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
    // Данные за текущий месяц
    const currentData = dynamics[dynamics.length - 1];

    // Данные за начало срока
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

    const handleFilter = (e: React.FormEvent) => {
      e.preventDefault();

      const params = new URLSearchParams();
      if (searchTerm) params.set('seach', searchTerm);
      if (selectedExp !== null) params.set('experience', selectedExp.toString());
      if (selectedRegion) params.set('region', selectedRegion);
      
      // Inertia.get(route('region.vacancies', {region: region:id}), params) РАСКОММЕНТИТЬ, КОГДА ПОДЪЕДЕТ ИНТЕГРАЦИЯ С ИНЕРЦИЕЙ
    }

    const handleExp = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedExp(value ? parseInt(value) : null);
    }

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRegion(e.target.value);
    }

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




