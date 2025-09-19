import type { VacancyProps } from "../../../vacancy/model/types";

export interface RegionData {
  id: number;
  name: string;
}

export interface MonthlyDynamisc {
  count: number;
  month: number | string;
  year: number;
}

export interface ExperienceOptions {
  value: number;
  label: string;
}

export interface RegionOptions {
  value: number;
  label: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface RegionPageProps {
  region: RegionData;
  vacancies: {
    data: VacancyProps[];
    current_page: number;
    last_page: number;
    elements_per_page: number;
    total_qtty: number;
    from: number;
    to: number;
  };
  dynamics: MonthlyDynamisc[];
  filters: {
    experience?: number;
    region?: number;
    search_query: string;
  };
  filterOptions: {
    experiences: ExperienceOptions[];
    regions: RegionOptions[];
  };
  links: PaginationLink[];
  query_params: {
    page?: number;
    experience?: number;
    region?: string;
    search_query?: string;
  }
}