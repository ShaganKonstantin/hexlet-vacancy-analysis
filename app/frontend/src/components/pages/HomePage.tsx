import { VacancyCard } from "../shared/VacancyCard";
import { FullVacancy } from "../shared/FullVacancy";
import { usePage } from "@inertiajs/react";
import type { VacancyCardProps } from "../../types";
import type React from "react";
import { Card, Grid, Container } from "@mantine/core";

interface HomePageProps {
  vacancies: VacancyCardProps[];
  [key: string]: any;
}

const HomePage: React.FC = () => {
  const { props } = usePage<HomePageProps>()
  console.log(props.vacancies);
  return (
      <Card>
        {props.vacancies.map((vacancy) => (
          <Card key={vacancy.id}>
              <VacancyCard props={vacancy}/>
              <FullVacancy props={vacancy}/>
          </Card>
        ))}
      </Card>
  );
};

export default HomePage;
