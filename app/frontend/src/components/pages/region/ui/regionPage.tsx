import React, { useEffect, useState } from "react";
import { VacancyCard } from "../../../shared/ui/vacancyCard";
import { VacancyDynamicsChart } from "../../../shared/vacancy/dynamics/ui/VacancyDynamicsChart";
import type { VacancyWithExperience } from "../../../shared/vacancy/model/types";
// import { test_vacancies } from '../../../shared/testData'
import { useVacancyFilters } from "../../../shared/vacancy/filters/model/useVacancyFilters";
import { useVacancyDynamics } from "../../../shared/vacancy/dynamics/model/useVacancyDynamics";
import { VacancyFilters } from "../../../shared/vacancy/filters/ui/VacancyFilters";
import { Building2 } from "lucide-react";
import { Container, Text, Card, Group, Grid, Divider, Badge, Stack } from "@mantine/core";
import { usePage } from "@inertiajs/react";


const experience_options = ['0-1', '2-4', '5+'];

interface PageProps extends Record<string, any> {
  region: {
    id: number;
    name: string;
    code: string;
  };
  vacancies: {
    data: Array<{
      id: number;
      title: string;
      company: string;
      url: string;
      description: string;
      salary: string; // Измените на string, чтобы соответствовать VacancyWithExperience
      city: string;
      key_skills: string[];
      experience: number;
    }>;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export const RegionPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { region, vacancies } = props;

    const transformedVacancies: VacancyWithExperience[] = vacancies.data.map(vacancy => ({
      // Копируем все поля из бэкенда
      id: vacancy.id,
      title: vacancy.title,
      company: vacancy.company,
      url: vacancy.url,
      description: vacancy.description,
      salary: vacancy.salary,
      city: vacancy.city,
      key_skills: vacancy.key_skills,
      experience: vacancy.experience,
      
      // Добавляем обязательные поля для VacancyWithExperience
      dynamics: [], // заглушка для динамики
      minExperience: vacancy.experience || 0, // используем experience из бэкенда
    }));

  const {
    selectedExperience,
    selectedRegion,
    searchQuery, 
    filteredVacancies, 
    setFilters
  } = useVacancyFilters(transformedVacancies)

  const dynamicsData = useVacancyDynamics(filteredVacancies);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;
  const lastPage = Math.ceil(filteredVacancies.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, lastPage || 1); // Страхуемся, что номер текущей страницы не больше, чем максимально возможное число страниц
  const paginatedVacancies = filteredVacancies.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // const region = selectedRegion || (paginatedVacancies.length > 0 ? paginatedVacancies[0].city : 'Регион');

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedExperience, selectedRegion, searchQuery])

  // Если приспичит сделать кнопки для переключения страниц
  // const handlePageChange = (newPage: number) => {
  //   if (newPage >= 1 && newPage <= lastPage) setCurrentPage(newPage);
  // }

  const calculateGrowth = (dynamics: VacancyWithExperience['dynamics']): number => {
    if (dynamics.length < 2) return 0;
    const startValue = dynamics[0].count;
    const currentValue = dynamics[dynamics.length - 1].count;
    
    return Math.round(((currentValue - startValue) / startValue) * 100)
  }

  return (
    <Container  bg='#f9f9f9' mx='auto' p='xl'>
      {/* Название региона */}
      <Card withBorder shadow="sm" radius='md' w='fit-content' p='md' mb='md'>
        <Group>
          <Building2 color="#20B0B4"/>
          <Text fz='xl' fw='bold' c='#0c2e4d'>{region.name}</Text>
        </Group>
      </Card>
      {/* Конец названия региона */}
      {/* Карточки с аналитикой по специальностям */}
      <Grid mb='md' gutter={{ base: 6, md: 12}}>
        {paginatedVacancies.length === 0 && (
          <Text mb='md' fz='xl' fw='bold' c='#0c2e4d' ta='center' p='md'>Вакансии не найдены</Text>
        )}
        {paginatedVacancies.map((vacancy) => {
          const growth = calculateGrowth(vacancy.dynamics);
          return (
            <Grid.Col key={vacancy.id} span={{ base:12, md:6 }}>
              <Card withBorder shadow="sm">
                <Text mb='sm' fz='sm'>{vacancy.title}</Text>
                <Group justify='space-between' mb='sm'>
                  <Text fw='bold' style={{ fontSize: '28px'}}>
                    {vacancy.dynamics.reduce((acc, cur) => acc + cur.count, 0)}
                  </Text>
                  <Badge variant="filled" color="#20B0B4">
                    {growth >= 0 ? `+${growth}` : `-${growth}`}
                  </Badge>
                </Group>
                <Divider color="#20B0B4" size='md' />
              </Card>
            </Grid.Col>
          )
        })}
      </Grid>
      {/* Конец карточек с аналитикой по специальностям */}
      {/* Динамика вакансий */}
      {dynamicsData.length > 0 && (
        <VacancyDynamicsChart data={dynamicsData}/>
      )}
      {/* Конец динамики вакансий */}
      {/* Фильтры */}
      <VacancyFilters
        experience={selectedExperience}
        region={selectedRegion}
        searchQuery={searchQuery}
        regionsOptions={Array.from(new Set(transformedVacancies.map((v: any) => v.city)))}
        experienceOptions={experience_options}
        onChangeFilters={setFilters}
      />
      {/* Конец фильров */}
      {/* Карточки с вакансиями */}
      <Stack gap='md'>
        {paginatedVacancies.map((vacancy) => (
          <VacancyCard key={vacancy.id} {...vacancy}/>
        ))}
      </Stack>
      {/* Конец карточек с вакансиями */}
    </Container>
  )
}
