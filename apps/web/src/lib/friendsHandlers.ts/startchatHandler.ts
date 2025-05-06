// import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";
// import { useRecoilValue } from "recoil";
// import { OrganizationUsersType } from "types/types";

// export default function startchatHandler(organizationUser: OrganizationUsersType) {
//     const userProfileData = useRecoilValue(userProfileAtom);

//     if (!organizationUser.user.username && !userProfileData.username) {
//         alert("Both the user's username is not available");
//     }

//     if (!organizationUser.user.username) {
//         alert("User you want to chat has not set their username");
//     }
//     if (!userProfileData.username) {
//         alert("please set you username in order to chat");
//     }
//     return;
// }