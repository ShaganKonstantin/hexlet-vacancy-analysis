import { VacancyCard } from "../vacancy";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Главная</h1>
      <p className="mt-4">Информация.</p>
      <VacancyCard 
      title="Frontend Developer"
      description="Создавать интерфейсы и компоненты"
      company="Tech Corp"
      salary="95000 - 125000 руб"
      city="Москва"
      id={1}
      key_skills={["React", "TypeScript", "CSS"]}
      />
    </div>
  );
};

export default HomePage;