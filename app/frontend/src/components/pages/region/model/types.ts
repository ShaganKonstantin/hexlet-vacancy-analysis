import type { VacancyProps } from "../../../vacancy/model/types";

export interface VacancyWithDynamics extends VacancyProps {
  dynamics: {
    count: number;
    month: string;
    year: number;
  }[];
}

export interface VacancyWithExperience extends VacancyWithDynamics {
  minExperience: number;
}

export interface RegionPageProps {
  region: string;
  vacancies: VacancyWithExperience[];
  experienceOptions: string[];
  countryRegions: string[];
  filters: {
    experience: string;
    region: string;
    query: string;
  };
  pagination: {
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  }
}