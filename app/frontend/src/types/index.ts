export interface User {
    name: string;
    fullName: string;
    avatarUrl: string;
    email: string;
}

export interface VacancyCardProps {
  id: number;
  title: string;
  url?: string;
  salary: string;
  experience?: string;
  employment?: string;
  company?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
  skills: string[];
  description: string;
}

interface Region {
  id: number;
  name: string;
}

export interface RegionPageProps {
  region: Region;
  vacancies: VacancyCardProps[];
  regionCities: Region[];
  filters: {
    experience: string;
    region: string;
    search: string;
  };
  pagination: {
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  }
}
