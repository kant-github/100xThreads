import { atom } from "recoil";

export enum RendererOption {
    Home,
    Notification,
    Events,
    AllOrganization,
    OwnedByYou,
    Settings,
}

export const dashboardOptionsAtom = atom<RendererOption>({
    key: "DashboardOptionsAtom",
    default: RendererOption.Home
})