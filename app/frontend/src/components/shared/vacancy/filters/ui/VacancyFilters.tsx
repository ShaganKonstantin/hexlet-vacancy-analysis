import React, { useState } from "react";
import { Group, Select, TextInput, Button, CloseButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Search } from "lucide-react";

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
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);

  const handleSearch = () => {
    onChangeFilters({ searchQuery: tempSearchQuery })
  }

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setTempSearchQuery('');
    onChangeFilters({ searchQuery: '' });
  }

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
          style={{ minWidth: '200px', flexGrow: isMobile? 1 : 0 }}
          checkIconPosition="right"
          clearable
        />
        <Select
          value={region}
          placeholder="Регион"
          data={regionsOptions.map((region) => ({
            value: region,
            label: region
          }))}
          onChange={(value) => onChangeFilters({region: value || ''})}
          style={{ minWidth: '200px', flexGrow: isMobile? 1 : 0 }}
          checkIconPosition="right"
          clearable
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
          value={tempSearchQuery}
          placeholder="Поиск по словам..."
          onChange={(e) => setTempSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: isMobile ? '100%' : 'auto' }}
          rightSection={
            tempSearchQuery ? (
              <CloseButton 
                onClick={handleClearSearch}
                size='sm'
              />
            ) : null
          }
        />
        <Button
          leftSection={<Search />}
          color="#20B0B4"
          style={{ width: isMobile ? '100%' : 'auto', flexShrink: 0 }}
          onClick={handleSearch}
        >
          Найти
        </Button>
      </Group>
      {/* Конец поиска по словам */}
    </Group>
  )
}