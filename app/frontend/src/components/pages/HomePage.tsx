// import { RegionPage } from "./region";
import { ProfessionPage } from "./profession";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Главная</h1>
      <p className="mt-4">Информация.</p>
      {/* <RegionPage /> */}
      <ProfessionPage/>
    </div>
  );
};

export default HomePage;