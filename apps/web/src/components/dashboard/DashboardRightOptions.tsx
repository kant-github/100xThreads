import { useRecoilValue } from "recoil";
import AllOrganizations from "./AllOrganizations";
import HomeComponent from "./HomeComponent";
import OwnedByYouComponent from "./OwnedByYouComponent";
import SettingsComponent from "./SettingsComponent";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";

export default function () {
  const renderOption = useRecoilValue(dashboardOptionsAtom);

  const renderComponent = () => {
    switch (renderOption) {
      case RendererOption.Home:
        return <HomeComponent />;
      case RendererOption.AllOrganization:
        return <AllOrganizations />;
      case RendererOption.OwnedByYou:
        return <OwnedByYouComponent />;
      case RendererOption.Settings:
        return <SettingsComponent />;
      default:
        return <div>No matching component found!</div>; // Fallback
    }
  };

  return (
    <div className="w-full bg-[#f2f2f2] dark:bg-[#1c1c1c]">
      {renderComponent()}
    </div>
  );
}
