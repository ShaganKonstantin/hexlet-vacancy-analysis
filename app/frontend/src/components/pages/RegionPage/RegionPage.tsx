import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Group, Text, Select, TextInput, Stack, Card, Container, CloseButton } from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks";
import { useDebouncedValue } from '@mantine/hooks';
import { VacancyCard } from "../../shared/VacancyCard";
import type { VacancyCardProps } from "../../../types";
import { Search } from "lucide-react";

interface Filters {
  experience: string;
  city: string;
  keywords: string;
}

interface VacancyFiltersProps {
  vacancies: VacancyCardProps[];
}

export const VacancyFilters: React.FC<VacancyFiltersProps> = ({ vacancies }) => {
  // Единое состояние фильтров
  const [filters, setFilters] = useState<Filters>({
    experience: '',
    city: '',
    keywords: ''
  });

  // Дебаунс для поискового запроса (задержка 300мс)
  const [debouncedKeywords] = useDebouncedValue(filters.keywords, 300);

  // Мемоизированные опции
  const experienceOptions = useMemo(() => [
    { value: 'no experience', label: 'Без опыта' },
    { value: '1-3 years', label: '1-3 года' },
    { value: '3-6 years', label: '3-6 лет' },
    { value: '6+ years', label: '6+ лет' }
  ], []);

  const cityOptions = useMemo(() => 
    Array.from(
      new Set(vacancies.filter(v => v.city?.name).map(v => v.city!.name))
    ).map(city => ({ value: city, label: city })),
    [vacancies]
  );

  // Мемоизированная функция определения опыта
  const getExperienceCategory = useCallback((experience: string): string => {
    if (!experience) return '';
    
    const exp = experience.toLowerCase().trim();
    
    if (exp.includes('без опыта') || exp.includes('нет опыта') || exp.includes('не требуется')) {
      return 'no experience';
    }
    
    const yearMatch = exp.match(/(\d+)\s*год/);
    if (yearMatch) {
      const years = parseInt(yearMatch[1]);
      if (years >= 1 && years <= 3) return '1-3 years';
      if (years >= 3 && years <= 6) return '3-6 years';
      if (years > 6) return '6+ years';
    }
    
    if (exp.includes('1-3') || exp.includes('1–3')) return '1-3 years';
    if (exp.includes('3-6') || exp.includes('3–6')) return '3-6 years';
    if (exp.includes('6+') || exp.includes('более 6')) return '6+ years';
    
    return '';
  }, []);

  // Мемоизированная функция фильтрации
  const filterVacancies = useCallback((
    vacancies: VacancyCardProps[], 
    filters: Filters
  ): VacancyCardProps[] => {
    return vacancies.filter(vacancy => {
      // Фильтр по опыту
      if (filters.experience && vacancy.experience) {
        const experienceCategory = getExperienceCategory(vacancy.experience);
        if (filters.experience !== experienceCategory) {
          return false;
        }
      }

      // Фильтр по городу
      if (filters.city && vacancy.city) {
        if (filters.city !== vacancy.city.name) {
          return false;
        }
      }

      // Фильтр по ключевым словам (используем дебаунс значение)
      if (filters.keywords.trim()) {
        const keywords = filters.keywords.toLowerCase().split(' ').filter(k => k.length > 0);
        const searchText = `${vacancy.title} ${vacancy.description} ${vacancy.skills.join(' ')} ${vacancy.company?.name || ''}`.toLowerCase();
        
        const hasAllKeywords = keywords.every(keyword => 
          searchText.includes(keyword)
        );
        
        if (!hasAllKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [getExperienceCategory]);

  // Обновленные фильтры с дебаунс поиском
  const effectiveFilters = useMemo(() => ({
    ...filters,
    keywords: debouncedKeywords
  }), [filters.experience, filters.city, debouncedKeywords]);

  // Мемоизированные отфильтрованные вакансии
  const filteredVacancies = useMemo(() => {
    return filterVacancies(vacancies, effectiveFilters);
  }, [vacancies, effectiveFilters, filterVacancies]);

  // Обработчики изменений фильтров
  const handleExperienceChange = useCallback((value: string | null) => {
    setFilters(prev => ({ ...prev, experience: value || '' }));
  }, []);

  const handleCityChange = useCallback((value: string | null) => {
    setFilters(prev => ({ ...prev, city: value || '' }));
  }, []);

  const handleKeywordsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, keywords: event.target.value }));
  }, []);

  // Сброс поиска
  const handleResetSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, keywords: '' }));
  }, []);

  const hasActiveFilters = effectiveFilters.experience || effectiveFilters.city || effectiveFilters.keywords;
  const isMobile = useMediaQuery('(max-width:768px)')

  return (
    <Container bg='#f9f9f9' mx='auto' p='xl'>
      {/* Фильтры */}
      <Group mb='xl' gap='md' wrap="wrap" justify="space-between">
        
        {/* Группа селектов */}
        <Group gap='md' wrap="wrap" style={{ flex: 1 }}>
          <Select
            placeholder="Опыт"
            value={filters.experience}
            onChange={handleExperienceChange}
            data={experienceOptions}
            clearable
            style={{ minWidth: isMobile ? '100%' : '200px' }}
          />

          <Select
            placeholder="Регион"
            value={filters.city}
            onChange={handleCityChange}
            data={cityOptions}
            clearable
            searchable
            style={{ minWidth: isMobile ? '100%' : '200px' }}
          />
        </Group>

        {/* Поле поиска */}
        <TextInput
          placeholder="Поиск по ключевым словам..."
          value={filters.keywords}
          onChange={handleKeywordsChange}
          rightSection={
            filters.keywords ? (
              <CloseButton
                onClick={handleResetSearch}
                size="sm"
              />
            ) : (
              <Search size={16} style={{ color: '#868E96' }} />
            )
          }
          style={{ minWidth: isMobile ? '100%' : '300px' }}
        />
      </Group>

      {/* Результаты */}
      <Stack gap="md">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map(vacancy => (
            <VacancyCard key={vacancy.id} props={vacancy} />
          ))
        ) : (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text ta="center" c="dimmed" py="xl">
              {hasActiveFilters 
                ? "По вашему запросу вакансий не найдено. Попробуйте изменить критерии поиска."
                : "Нет доступных вакансий"
              }
            </Text>
          </Card>
        )}
      </Stack>
    </Container>
  );
};