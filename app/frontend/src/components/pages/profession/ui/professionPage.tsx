import React, { useState } from "react";
import { VacancyCard } from "../../../shared/ui/vacancyCard";
import { useVacancyDynamics } from "../../../vacancy/dynamics/model/useVacancyDynamics";
import { useVacancyFilters } from "../../../vacancy/filters/model/useVacancyFilters";
import { VacancyDynamicsChart } from "../../../vacancy/dynamics/ui/VacancyDynamicsChart";
import { VacancyFilters } from "../../../vacancy/filters/ui/VacancyFilters";
import type { VacancyWithExperience } from "../../../vacancy/model/types";
import { test_vacancies } from "../../region/testData";
import { Laptop } from "lucide-react";

const experience_options = ['0-1', '2-4', '5+'];

export const ProfessionPage: React.FC = () => {
  const {
    selectedExperience,
    selectedRegion,
    searchQuery, 
    filteredVacancies, 
    setFilters
  } = useVacancyFilters(test_vacancies)

  const dynamicsData = useVacancyDynamics(filteredVacancies)

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;
  const lastPage = Math.ceil(filteredVacancies.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, lastPage || 1);
  const paginatedVacancies = filteredVacancies.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const profession = searchQuery || (paginatedVacancies.length > 0 ? paginatedVacancies[0].title : 'Профессия');

  return (
    <div className="container bg-[#f9f9f9] mx-auto p-6">
      {/* Название професии */}
      <div className="flex items-center w-fit border border-gray-200 rounded shadow text-2xl font-bold text-[#0c2e4d] p-3 mb-4">
      <Laptop className="mr-2" color="#20B0B4"/>
        {profession}
      </div>
      {/* Конец названия профессии */}
      {/* Динамика вакансий */}
      {dynamicsData.length > 0 && (
        <VacancyDynamicsChart data={dynamicsData} />
      )}
      {/* Конец динамики вакансий */}
      {/* Топ регионов */}
      <div className="w-fit border border-gray-200 rounded shadow text-2xl font-bold text-[#0c2e4d] p-3 mb-4">Топ регионов</div>
      {/* Конец топа регионов */}
      {/* Фильтр */}
      <VacancyFilters
      experience={selectedExperience}
      region={selectedRegion}
      searchQuery={searchQuery}
      regionsOptions={Array.from(new Set(test_vacancies.map((v) => v.city)))}
      experienceOptions={experience_options}
      onChangeFilters={setFilters}
      />
      {/* Конец фильтра */}
      {/* Карточки вакансий */}
      {paginatedVacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} {...vacancy} />
      ))}
      {/* Конец карточки вакансий */}
    </div>
  )
}