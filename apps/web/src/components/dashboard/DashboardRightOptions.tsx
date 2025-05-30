import { useRecoilValue } from "recoil";
import AllOrganizations from "./AllOrganizations";
import HomeComponent from "./HomeComponent";
import OwnedByYouComponent from "./OwnedByYouComponent";
import SettingsComponent from "./SettingsComponent";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";
import EventsDashboard from "./EventsDashboard";

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
      case RendererOption.Events:
        return <EventsDashboard />;
      default:
        return <div>No matching component found!</div>;
    }
  };

  return (
    <div className="w-full bg-light dark:bg-neutral-900 h-full">
      {renderComponent()}
    </div>
  );
}
