import { VacancyCard } from "../shared/VacancyCard";
import { FullVacancy } from "../shared/FullVacancy";
import { usePage } from "@inertiajs/react";
import type React from "react";
import type { VacancyCardProps } from "../../types";
import { Card } from "@mantine/core";

interface HomePageProps {
  vacancies: VacancyCardProps[];
  [key: string]: any;
}

const HomePage: React.FC = () => {
  const { props } = usePage<HomePageProps>()
  console.log(props.vacancies);
  return (
    <div>
      {props.vacancies.map((vacancy) => (
        <Card key={vacancy.id}>
          <VacancyCard props={vacancy}/>
          <FullVacancy props={vacancy}/>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
