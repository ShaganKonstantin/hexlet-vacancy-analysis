import React, { useMemo, useState } from "react";
import { VacancyCard } from "../../../vacancy";
import type { VacancyProps } from "../../../vacancy/model/types";
import type { VacancyWithExperience, RegionPageProps, VacancyWithDynamics } from "../model/types";
import { test_vacancies } from '../testData'

const experience_options: RegionPageProps['experienceOptions'] = ['0-1', '2-4', '5+'];
const country_regions: RegionPageProps['countryRegions'] = ['Санкт-Петербург', 'Москва', 'Новороссийск'];
const experienceRange: Record<string, [number, number]> = {
  '0-1': [0, 1],
  '2-4': [2, 4],
  '5+': [5, Infinity],
}

export const RegionPage: React.FC = () => {
  const region: RegionPageProps['region'] = 'Санкт-Петербург';
  
  const [selectedExperience, setSelectedExperience] = useState<RegionPageProps['filters']['experience']>('');
  const [selectedRegion, setSelectedRegion] = useState<RegionPageProps['filters']['region']>('');
  const [searchQuery, setSearchQuery] = useState<RegionPageProps['filters']['query']>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 3;

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) setCurrentPage(newPage);
  }

  const calculateGrowth = (dynamics: VacancyWithDynamics['dynamics']): number => {
    if (dynamics.length < 2) return 0;
    const startValue = dynamics[0].count;
    const currentValue = dynamics[dynamics.length - 1].count;
    
    return Math.round(((currentValue - startValue) / startValue) * 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedVacancies.length === 0 &&
      <p>Вакансии не найдены</p>}
    </div>
  )
}
