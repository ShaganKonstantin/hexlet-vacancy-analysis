import React, { useMemo, useState } from "react";
import { VacancyCard } from "../../../vacancy";
import type { VacancyProps } from "../../../vacancy/model/types";
import type { VacancyWithExperience, RegionPageProps, VacancyWithDynamics } from "../model/types";
import { test_vacancies } from '../testData'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const experience_options: RegionPageProps['experienceOptions'] = ['0-1', '2-4', '5+'];
const experienceRange: Record<string, [number, number]> = {
  '0-1': [0, 1],
  '2-4': [2, 4],
  '5+': [5, Infinity],
}

const monthOrder = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export const RegionPage: React.FC = () => {
  const country_regions: RegionPageProps['countryRegions'] = useMemo(() => {
    return Array.from(new Set(test_vacancies.map((vacancy) => vacancy.city)))
  }, [test_vacancies]);

  const [selectedExperience, setSelectedExperience] = useState<RegionPageProps['filters']['experience']>('');
  const [selectedRegion, setSelectedRegion] = useState<RegionPageProps['filters']['region']>('');
  const [searchQuery, setSearchQuery] = useState<RegionPageProps['filters']['query']>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 4;

  const filteredVacancies = useMemo(() => {
    return test_vacancies.filter((vacancy) => {
      /**
       * Функция фильтра для вакансии 
       * 
       * @param {VacancyWithExperience} vacancy - Объект вакансии
       * @param {Record<string, [number, number]>} experienceRange - это словарь, в котором ключи - строки, а значения - кортежи с двумя числами
       * @param {string} selectedExperience - это строка, которую пользователь выбрал с селекте
       * @returns {boolean} true, если опыт вакансии входит в выбранный диапазон или фильтр не выбран
      */
      const experienceMatch = selectedExperience ? (() => {
        const range = experienceRange[selectedExperience];
        if (!range) return true; // Если не выбран диапазон, то проверку проходят все вакансии и показываются
        const [min, max] = range;
        return vacancy.minExperience >= min && vacancy.minExperience <= max;
      })() : true

      const regionMatch = selectedRegion ? vacancy.city === selectedRegion : true; 

      const queryMatch = searchQuery 
        ? vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vacancy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vacancy.key_skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        : true; // Если нет ни одного совпадения, то не фильтрует по словам, а просто показывает результат

        return experienceMatch && regionMatch && queryMatch;
    })
  }, [selectedExperience, selectedRegion, searchQuery])
  
  const lastPage = Math.ceil(filteredVacancies.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, lastPage || 1); // Страхуемся, что номер текущей страницы не больше, чем максимально возможное число страниц

  const paginatedVacancies = filteredVacancies.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const region = selectedRegion || (paginatedVacancies.length > 0 ? paginatedVacancies[0].city : 'Регион');

  // Если приспичит сделать кнопки для переключения страниц
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) setCurrentPage(newPage);
  }

  const calculateGrowth = (dynamics: VacancyWithDynamics['dynamics']): number => {
    if (dynamics.length < 2) return 0;
    const startValue = dynamics[0].count;
    const currentValue = dynamics[dynamics.length - 1].count;
    
    return Math.round(((currentValue - startValue) / startValue) * 100)
  }

  const dynamicsByMonth = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    monthOrder.forEach((month) => {
      monthCounts[month] = 0;
    })

    for (const vacancy of test_vacancies) {
      for (const dynamics of vacancy.dynamics) {
        monthCounts[dynamics.month] = (monthCounts[dynamics.month] || 0) + dynamics.count;
      }
    }

    const data = monthOrder.map((month) => ({ month, count: monthCounts[month] })).filter((item) => item.count > 0);

    return data;
  }, [test_vacancies]);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-gray-200 rounded shadow p-4">
        {/* Селекты */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-4">
          {/* Опыт */}
          <div className="relative inline-block w-full">
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setCurrentPage(1);
              }}
              className="text-[#2f4664] border border-gray-200 rounded p-2 md:w-30 w-full appearance-none pr-6"
            >
              <option value="">Опыт</option>
              {experience_options.map((exp) => (
                <option key={exp} value={exp}>{exp === '5+' ? `${exp} лет` : `${exp} года`}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#afb8c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {/* Регион */}
          <div className="relative inline-block w-full">
            <select 
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }} 
              className="appearance-none text-[#2f4664] border border-gray-200 rounded p-2 md:w-42 w-full" 
            >
              <option value="">Регион</option>
              {country_regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
              <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#afb8c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
          </div>
        </div>
        {/* Конец селектов */}
        {/* Поиск по словам */}
        <div className="flex flex-wrap w-full md:w-auto gap-4">
          <input 
            type="text" 
            placeholder="Поиск по ключевым словам..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1)
            }}
            className="border border-gray-200 rounded p-2 flex-grow w-full md:w-60 text-xs"
            style={{ fontSize: '14px' }}
          />
          <button className="flex items-center justify-center text-white px-4 py-1 rounded-md cursor-pointer bg-[#20B0B4] w-full md:w-auto hover:bg-[#1a8f90]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
            Найти</button>
        </div>
      </div>
      {/* Конец фильтров */}
      {paginatedVacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} {...vacancy} />
      ))}
    </div>
  )
}
