import type { VacancyWithDynamics } from "./model/types";
import type { VacancyWithExperience } from "./model/types";

export const test_vacancies: VacancyWithExperience[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Создавать интерфейсы и компоненты",
    company: "Tech Corp",
    salary: "120000",
    city: "Санкт-Петербург",
    key_skills: ["React", "TypeScript", "CSS"],
    minExperience: 3,
    dynamics: [
      { count: 1200, month: "Янв", year: 2024 },
      { count: 1450, month: "Фев", year: 2024 },
      { count: 1680, month: "Мар", year: 2024 },
      { count: 1920, month: "Апр", year: 2024 },
      { count: 2100, month: "Май", year: 2024 },
      { count: 2350, month: "Июн", year: 2024 },
    ],
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Разработка серверной части приложений",
    company: "Data Systems",
    salary: "130000",
    city: "Санкт-Петербург",
    key_skills: ["Node.js", "Express", "PostgreSQL"],
    minExperience: 2,
    dynamics: [
      { count: 900, month: "Янв", year: 2024 },
      { count: 950, month: "Фев", year: 2024 },
      { count: 970, month: "Мар", year: 2024 },
      { count: 915, month: "Апр", year: 2024 },
      { count: 920, month: "Май", year: 2024 },
      { count: 938, month: "Июн", year: 2024 },
    ],
  },
  {
    id: 3,
    title: "QA инженер",
    description: "Тестирование программного обеспечения",
    company: "QualityWorks",
    salary: "90000",
    city: "Санкт-Петербург",
    key_skills: ["Selenium", "Jest", "Git"],
    minExperience: 5,
    dynamics: [
      { count: 500, month: "Янв", year: 2024 },
      { count: 600, month: "Фев", year: 2024 },
      { count: 620, month: "Мар", year: 2024 },
      { count: 630, month: "Апр", year: 2024 },
      { count: 640, month: "Май", year: 2024 },
      { count: 670, month: "Июн", year: 2024 },
    ],
  },
];
