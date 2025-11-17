// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Group, Text, Select, TextInput, Stack, Card, Container, CloseButton, Pagination } from '@mantine/core';
// import { useMediaQuery } from "@mantine/hooks";
// import { useDebouncedValue } from '@mantine/hooks';
// import { VacancyCard } from "../../shared/VacancyCard";
// import type { VacancyCardProps } from "../../../types";
// import { Search } from "lucide-react";

// interface Filters {
//   experience: string;
//   city: string;
//   keywords: string;
// }

// interface VacancyFiltersProps {
//   vacancies: VacancyCardProps[];
// }

// export const VacancyFilters: React.FC<VacancyFiltersProps> = ({ vacancies }) => {
//   // Общее состояние фильтров
//   const [filters, setFilters] = useState<Filters>({
//     experience: '',
//     city: '',
//     keywords: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   // Дебаунс для поискового запроса (задержка 300мс)
//   const [debouncedKeywords] = useDebouncedValue(filters.keywords, 300);

//   // Мемоизированные опции по опыту
//   const experienceOptions = useMemo(() => [
//     { value: 'no experience', label: 'Без опыта' },
//     { value: '1-3 years', label: '1-3 года' },
//     { value: '3-6 years', label: '3-6 лет' },
//     { value: '6+ years', label: '6+ лет' }
//   ], []);

//   const cityOptions = useMemo(() => 
//     Array.from(
//       new Set(vacancies.filter(v => v.city?.name).map(v => v.city!.name))
//     ).map(city => ({ value: city, label: city })),
//     [vacancies]
//   );

//   // Мемоизированная функция определения опыта
//   const getExperienceCategory = useCallback((experience: string): string => {
//     if (!experience) return '';
    
//     const exp = experience.toLowerCase().trim();
    
//     if (exp.includes('без опыта') || exp.includes('нет опыта') || exp.includes('не требуется')) {
//       return 'no experience';
//     }
    
//     const yearMatch = exp.match(/(\d+)\s*год/);
//     if (yearMatch) {
//       const years = parseInt(yearMatch[1]);
//       if (years >= 1 && years <= 3) return '1-3 years';
//       if (years >= 3 && years <= 6) return '3-6 years';
//       if (years > 6) return '6+ years';
//     }
    
//     if (exp.includes('1-3') || exp.includes('1–3')) return '1-3 years';
//     if (exp.includes('3-6') || exp.includes('3–6')) return '3-6 years';
//     if (exp.includes('6+') || exp.includes('более 6')) return '6+ years';
    
//     return '';
//   }, []);

//   // Мемоизированная функция фильтрации
//   const filterVacancies = useCallback((
//     vacancies: VacancyCardProps[], 
//     filters: Filters
//   ): VacancyCardProps[] => {
//     return vacancies.filter(vacancy => {
//       // Фильтр по опыту
//       if (filters.experience && vacancy.experience) {
//         const experienceCategory = getExperienceCategory(vacancy.experience);
//         if (filters.experience !== experienceCategory) {
//           return false;
//         }
//       }

//       // Фильтр по городу
//       if (filters.city) {
//         if (!vacancy.city || vacancy.city.name !== filters.city) {
//           return false;
//         }
//       }

//       // Фильтр по ключевым словам с дебаунс вводом
//       if (filters.keywords.trim()) {
//         const keywords = filters.keywords.toLowerCase().split(' ').filter(k => k.length > 0);
//         const searchText = `${vacancy.title} ${vacancy.description} ${vacancy.skills.join(' ')} ${vacancy.company?.name || ''}`.toLowerCase();
        
//         const hasAllKeywords = keywords.every(keyword => 
//           searchText.includes(keyword)
//         );
        
//         if (!hasAllKeywords) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [getExperienceCategory]);

//   // Обновленные фильтры с дебаунс поиском
//   const effectiveFilters = useMemo(() => ({
//     ...filters,
//     keywords: debouncedKeywords
//   }), [filters.experience, filters.city, debouncedKeywords]);

//   // Мемоизированные отфильтрованные вакансии
//   const filteredVacancies = useMemo(() => {
//     return filterVacancies(vacancies, effectiveFilters);
//   }, [vacancies, effectiveFilters, filterVacancies]);

//   // Сколько вакансий берем из массива
//   const paginatedVacancies = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage; // Индекс, НАЧИНАЯ с которого берутся итемы
//     const lastIndex = startIndex + itemsPerPage; // Индекс ДО КОТОРОГО берутся итемы, не включая его самого
//     return filteredVacancies.slice(startIndex, lastIndex);
//   }, [filteredVacancies, currentPage])

//   const totalPagesQuantity = useMemo(() => {
//     return Math.ceil(filteredVacancies.length / itemsPerPage)
//   }, [filteredVacancies.length])


//   // Сбрасывает пагинацию если меняются фильтры
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [effectiveFilters])

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'instant' })
//   }, [])

//   // Обработчики изменений фильтров
//   const handleExperienceChange = useCallback((value: string | null) => {
//     setFilters(prev => ({ ...prev, experience: value || '' }));
//   }, []);

//   const handleCityChange = useCallback((value: string | null) => {
//     setFilters(prev => ({ ...prev, city: value || '' }));
//   }, []);

//   const handleKeywordsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     setFilters(prev => ({ ...prev, keywords: event.target.value }));
//   }, []);

//   // Сброс поиска
//   const handleResetSearch = useCallback(() => {
//     setFilters(prev => ({ ...prev, keywords: '' }));
//   }, []);

//   const hasActiveFilters = effectiveFilters.experience || effectiveFilters.city || effectiveFilters.keywords;
//   const isMobile = useMediaQuery('(max-width:768px)')

//   return (
//     <Container bg='#f9f9f9' mx='auto' p='xl'>
//       {/* Фильтры */}
//       <Group mb='xl' gap='md' wrap="wrap" justify="space-between">
        
//         {/* Селекты по опыту и региону */}
//         <Group gap='md' wrap="wrap" style={{ flex: 1 }}>
//           <Select
//             placeholder="Опыт"
//             value={filters.experience}
//             onChange={handleExperienceChange}
//             data={experienceOptions}
//             clearable
//             checkIconPosition="right"
//             style={{ minWidth: isMobile ? '100%' : '200px' }}
//           />

//           <Select
//             placeholder="Регион"
//             value={filters.city}
//             onChange={handleCityChange}
//             data={cityOptions}
//             clearable
//             searchable
//             checkIconPosition="right"
//             style={{ minWidth: isMobile ? '100%' : '200px' }}
//           />
//         </Group>

//         {/* Поиск по словам */}
//         <TextInput
//           placeholder="Поиск по ключевым словам..."
//           value={filters.keywords}
//           onChange={handleKeywordsChange}
//           rightSection={
//             filters.keywords ? (
//               <CloseButton
//                 onClick={handleResetSearch}
//                 size="sm"
//               />
//             ) : (
//               <Search size={16} style={{ color: '#868E96' }} />
//             )
//           }
//           style={{ minWidth: isMobile ? '100%' : '300px' }}
//         />
//       </Group>

//       {/* Карточки с ваканисей */}
//       <Stack gap="md">
//         {paginatedVacancies.length > 0 ? (
//           paginatedVacancies.map(vacancy => (
//             <VacancyCard key={vacancy.id} props={vacancy} />
//           ))
//         ) : (
//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Text ta="center" c="dimmed" py="xl">
//               {hasActiveFilters 
//                 ? "По вашему запросу вакансий не найдено. Попробуйте изменить критерии поиска."
//                 : "Нет доступных вакансий"
//               }
//             </Text>
//           </Card>
//         )}
//       </Stack>

//       {/* Кнопки со номерами страниц */}
//       {totalPagesQuantity > 1 && (
//         <Pagination 
//           total={totalPagesQuantity}
//           boundaries={2}
//           siblings={2}
//           value={currentPage}
//           onChange={handlePageChange}
//           color="#20B0B4"
//         />
//       )}
//     </Container>
//   );
// };

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Group, Text, Select, TextInput, Stack, Card, Container, CloseButton } from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks";
import { useDebouncedValue } from '@mantine/hooks';
import { Head, Link, usePage, router } from '@inertiajs/react'; // Добавлен router
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
  const { url } = usePage();
  
  // Получаем текущие параметры из URL
  const getInitialFiltersFromURL = (): Filters => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      experience: urlParams.get('experience') || '',
      city: urlParams.get('city') || '',
      keywords: urlParams.get('keywords') || ''
    };
  };

  const getCurrentPageFromURL = (): number => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page') || '1');
  };

  // Общее состояние фильтров
  const [filters, setFilters] = useState<Filters>(getInitialFiltersFromURL);
  const [currentPage, setCurrentPage] = useState(getCurrentPageFromURL);

  const itemsPerPage = 10;

  // Дебаунс для поискового запроса (задержка 300мс)
  const [debouncedKeywords] = useDebouncedValue(filters.keywords, 300);

  // Мемоизированные опции по опыту
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
      if (filters.city) {
        if (!vacancy.city || vacancy.city.name !== filters.city) {
          return false;
        }
      }

      // Фильтр по ключевым словам с дебаунс вводом
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

  // Сколько вакансий берем из массива
  const paginatedVacancies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const lastIndex = startIndex + itemsPerPage;
    return filteredVacancies.slice(startIndex, lastIndex);
  }, [filteredVacancies, currentPage])

  const totalPagesQuantity = useMemo(() => {
    return Math.ceil(filteredVacancies.length / itemsPerPage)
  }, [filteredVacancies.length])

  // Функция для построения URL с фильтрами и пагинацией
  const buildURL = (page: number = 1, filters: Filters = effectiveFilters): string => {
    const params = new URLSearchParams();
    
    if (filters.experience) params.set('experience', filters.experience);
    if (filters.city) params.set('city', filters.city);
    if (filters.keywords) params.set('keywords', filters.keywords);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    return queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  };

  // Сбрасывает пагинацию если меняются фильтры
  useEffect(() => {
    setCurrentPage(1);
    // Обновляем URL через Inertia router
    const newUrl = buildURL(1, effectiveFilters);
    router.get(newUrl, {}, {
      preserveState: true,
      replace: true,
      preserveScroll: true
    });
  }, [effectiveFilters.experience, effectiveFilters.city, effectiveFilters.keywords])

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

  // Обработка кнопок браузера "назад/вперед" и синхронизация с URL
  useEffect(() => {
    const handlePopState = () => {
      setFilters(getInitialFiltersFromURL());
      setCurrentPage(getCurrentPageFromURL());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Синхронизация состояния с URL при изменении параметров
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentExperience = urlParams.get('experience') || '';
    const currentCity = urlParams.get('city') || '';
    const currentKeywords = urlParams.get('keywords') || '';
    const currentPageFromURL = parseInt(urlParams.get('page') || '1');

    if (currentExperience !== filters.experience || 
        currentCity !== filters.city || 
        currentKeywords !== filters.keywords ||
        currentPageFromURL !== currentPage) {
      setFilters({
        experience: currentExperience,
        city: currentCity,
        keywords: currentKeywords
      });
      setCurrentPage(currentPageFromURL);
    }
  }, [url]); // Зависимость от url из usePage()

  // Обработчик клика по пагинации
  const handlePageClick = useCallback((page: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    setCurrentPage(page);
    const newUrl = buildURL(page);
    
    router.get(newUrl, {}, {
      preserveState: true,
      replace: true,
      preserveScroll: true,
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }, [effectiveFilters]);

  const hasActiveFilters = effectiveFilters.experience || effectiveFilters.city || effectiveFilters.keywords;
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <>
      <Head title="Вакансии" />
      
      <Container bg='#f9f9f9' mx='auto' p='xl'>
        {/* Фильтры */}
        <Group mb='xl' gap='md' wrap="wrap" justify="space-between">
          
          {/* Селекты по опыту и региону */}
          <Group gap='md' wrap="wrap" style={{ flex: 1 }}>
            <Select
              placeholder="Опыт"
              value={filters.experience}
              onChange={handleExperienceChange}
              data={experienceOptions}
              clearable
              checkIconPosition="right"
              style={{ minWidth: isMobile ? '100%' : '200px' }}
            />

            <Select
              placeholder="Регион"
              value={filters.city}
              onChange={handleCityChange}
              data={cityOptions}
              clearable
              searchable
              checkIconPosition="right"
              style={{ minWidth: isMobile ? '100%' : '200px' }}
            />
          </Group>

          {/* Поиск по словам */}
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

        {/* Карточки с вакансиями */}
        <Stack gap="md" mb="xl">
          {paginatedVacancies.length > 0 ? (
            paginatedVacancies.map(vacancy => (
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

        {/* Пагинация через Inertia Link */}
        {totalPagesQuantity > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Previous Page */}
              {currentPage > 1 && (
                <Link
                  href={buildURL(currentPage - 1)}
                  onClick={(e) => handlePageClick(currentPage - 1, e)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#20B0B4'
                  }}
                >
                  &laquo; Назад
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: totalPagesQuantity }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPagesQuantity || 
                  Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => {
                  // Добавляем многоточие для пропущенных страниц
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span style={{ padding: '8px 4px', color: '#6c757d' }}>...</span>
                      )}
                      <Link
                        href={buildURL(page)}
                        onClick={(e) => handlePageClick(page, e)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          backgroundColor: page === currentPage ? '#20B0B4' : 'transparent',
                          color: page === currentPage ? 'white' : '#20B0B4',
                          fontWeight: page === currentPage ? 'bold' : 'normal'
                        }}
                      >
                        {page}
                      </Link>
                    </React.Fragment>
                  );
                })}

              {/* Next Page */}
              {currentPage < totalPagesQuantity && (
                <Link
                  href={buildURL(currentPage + 1)}
                  onClick={(e) => handlePageClick(currentPage + 1, e)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#20B0B4'
                  }}
                >
                  Вперёд &raquo;
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Информация о пагинации */}
        {paginatedVacancies.length > 0 && (
          <Text ta="center" c="dimmed" mt="md" size="sm">
            Показано {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredVacancies.length)} из {filteredVacancies.length} вакансий
          </Text>
        )}
      </Container>
    </>
  );
};