import React, { useMemo, useState } from "react";
import { VacancyCard } from "../../../shared/ui/vacancyCard";
import type { RegionPageProps } from "../model/types";
import type { VacancyWithExperience } from "../../../vacancy/model/types";
import { test_vacancies } from '../testData'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const experience_options: RegionPageProps['experienceOptions'] = ['0-1', '2-4', '5+'];

export const RegionPage: React.FC = () => {
  const country_regions: RegionPageProps['countryRegions'] = useMemo(() => {
    return Array.from(new Set(test_vacancies.map((vacancy) => vacancy.city)))
  }, [test_vacancies]);



  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const lastPage = Math.ceil(filteredVacancies.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, lastPage || 1); // Страхуемся, что номер текущей страницы не больше, чем максимально возможное число страниц

  const paginatedVacancies = filteredVacancies.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const region = selectedRegion || (paginatedVacancies.length > 0 ? paginatedVacancies[0].city : 'Регион');

  // Если приспичит сделать кнопки для переключения страниц
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) setCurrentPage(newPage);
  }

  const calculateGrowth = (dynamics: VacancyWithExperience['dynamics']): number => {
    if (dynamics.length < 2) return 0;
    const startValue = dynamics[0].count;
    const currentValue = dynamics[dynamics.length - 1].count;
    
    return Math.round(((currentValue - startValue) / startValue) * 100)
  }

  return (
    <div className="container bg-[#f9f9f9] mx-auto p-6">
      {/* Название региона */}
      <div className="w-fit border border-gray-200 rounded shadow text-2xl font-bold text-[#0c2e4d] p-3 mb-4">
        {region}
      </div>
      {/* Конец названия региона */}
      {/* Карточки с аналитикой по специальностям */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {
        paginatedVacancies.length === 0 &&
        <p>Вакансии не найдены</p>
        }
        {paginatedVacancies.map((vacancy) => {
          const growth = calculateGrowth(vacancy.dynamics);
          return (
            <div key={vacancy.id} className="border bg-white border-gray-200 rounded shadow p-4">
              <h2 className="text-sm font-semibold text-[#0c2e4d] mb-1">{vacancy.title}</h2>
              <div className="flex justify-between items-start">
                <p className="text-2xl font-bold text-[#0c2e4d] mb-2">
                  {vacancy.dynamics.reduce((acc, cur) => acc + cur.count, 0)}
                </p>
                <div className="inline-flex items-center px-2 rounded-full bg-[#20B0B4]">
                  <div className="text-white text-sm">{growth >= 0 ? '+' : '-'}{growth}%</div>
                </div>
              </div>
              <hr className="w-full h-1 border border-solid rounded-full border-[#20B0B4] bg-[#20B0B4]" />
            </div>
          )
        })}
      </div>
      {/* Конец карточек с аналитикой по специальностям */}
      {/* Диаграмма с вакансиями */}
      <div className="w-full h-64 mb-6 bg-white border border-gray-200 rounded shadow p-4">
        <h2 className="text-xl font-bold text-[#0c2e4d] mb-4">Динамика вакансий</h2>
        <div className="md:w-1/2 mx-auto h-full">
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={dynamicsByMonth}
              margin={{ top: 10, right: 15, left: 15, bottom: 25}}    
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20B0B4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#20B0B4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='month' interval={0} tick={{ fontSize: 12 }}/>
              <CartesianGrid vertical={false} strokeDasharray="" />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#20B0B4" fillOpacity={1} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Конец диграммы с вакансиями */}
      {/* Фильтры */}

      {/* Конец фильтров */}
      {paginatedVacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} {...vacancy} />
      ))}
    </div>
  )
}
