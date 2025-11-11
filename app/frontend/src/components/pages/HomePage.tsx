// import { VacancyCard } from "../shared/VacancyCard";
// import { FullVacancy } from "../shared/FullVacancy";
// import { usePage } from "@inertiajs/react";
// import type { VacancyCardProps } from "../../types";
// import type React from "react";
// import { Card, Grid, Container } from "@mantine/core";
// import type { RegionPageProps } from "../../types";
// import { RegionPage } from "./RegionPage/RegionPage";

// interface HomePageProps {
//   vacancies: RegionPageProps[];
//   [key: string]: any;
// }

// const HomePage: React.FC = () => {
//   const { props } = usePage<HomePageProps>()
//   console.log(props.vacancies);
//   return (

//   );
// };

// export default HomePage;
import React from "react";
import type { VacancyCardProps } from "../../types";
import { VacancyFilters } from "./RegionPage/RegionPage";

const HomePage: React.FC<{ vacancies: VacancyCardProps[] }> = ({ vacancies }) => {
  return (
    <div>
      <VacancyFilters vacancies={vacancies} />
    </div>
  );
};

export default HomePage;