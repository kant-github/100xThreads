import { atom } from "recoil";

export enum RendererOption{
    Home,
    AllOrganization,
    OwnedByYou,
    Settings
}

export const dashboardOptionsAtom = atom<RendererOption>({
    key: "DashboardOptionsAtom",
    default: RendererOption.Home
})