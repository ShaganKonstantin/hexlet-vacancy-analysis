import React from "react";
// import { ChevronDown } from "lucide-react";
import { Group, Select, TextInput, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ChevronDown, Search } from "lucide-react";

interface VacancyFiltersProps {
  experience: string;
  region: string;
  searchQuery: string;
  regionsOptions: string[];
  experienceOptions: string[];
  onChangeFilters: (params: { experience?: string; region?: string; searchQuery?: string; }) => void;
}

export const VacancyFilters: React.FC<VacancyFiltersProps> = ({ experience, region, searchQuery, regionsOptions, experienceOptions, onChangeFilters }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Group
      mb='xl'
      gap='md'
      wrap="wrap"
      justify="space-between"
    >
      {/* Селекты */}
      <Group gap='md' wrap="wrap" style={{ flex: isMobile ? '0 0 100%' : 1 }}>
        <Select
          value={experience}
          placeholder="Опыт"
          data={experienceOptions.map((exp) => ({
            value: exp,
            label: exp === '5+' ? `${exp} лет` : `${exp} года`
          }))}
          onChange={(value) => onChangeFilters({experience: value || ''})}
          rightSection={<ChevronDown />}
          style={{ minWidth: '200px', flexGrow: isMobile? 1 : 0 }}
        />
        <Select
          value={region}
          placeholder="Регион"
          data={regionsOptions.map((region) => ({
            value: region,
            label: region
          }))}
          onChange={(value) => onChangeFilters({region: value || ''})}
          rightSection={<ChevronDown />}
          style={{ minWidth: '200px', flexGrow: isMobile? 1 : 0 }}
        />
      </Group>
      {/* Конец селектов */}   
      {/* Поиск по словам */}   
      <Group 
        wrap={isMobile ? "wrap" : "nowrap"} 
        style={{ 
          flex: isMobile ? '0 0 100%' : 1,
          minWidth: isMobile ? '100%' : '400px'
        }}
        gap={isMobile ? 'md' : 'sm'}
        justify="flex-end"
      >
        <TextInput 
          value={searchQuery}
          placeholder="Поиск по словам..."
          onChange={(e) => onChangeFilters({ searchQuery: e.target.value })}
          style={{ width: isMobile ? '100%' : 'auto' }}
        />
        <Button
          leftSection={<Search />}
          color="#20B0B4"
          style={{ width: isMobile ? '100%' : 'auto', flexShrink: 0 }}
        >
          Найти
        </Button>
      </Group>
      {/* Конец поиска по словам */}
    </Group>
  )
}