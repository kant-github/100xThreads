"use client";
import { FaList } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationType } from "types";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { useEffect, useState } from "react";
import { fetchAllOrganization } from "fetch/fetchOrganizations";
import { allOrganizationDisplaytype, DisplayType, userSessionAtom } from "@/recoil/atoms/atom";
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import DashboardComponentHeading from "./DashboardComponentHeading";
import ListTypeOrganizations from "../ui/ListTypeOrganizations";

const testOrgs = [
  {
    title: "Tech Innovators",
    description: "A community for tech enthusiasts and innovators.",
    tags: ["technology", "innovation", "startups"],
    logo: "https://picsum.photos/seed/techinnovators/200/200",
    totalUsers: 5400,
    onlineUsers: 320,
    owner: "Alice Johnson",
    createdAt: "2020-05-15",
  },
  {
    title: "Health & Wellness Hub",
    description: "Promoting healthy living and wellness practices.",
    tags: ["health", "fitness", "wellness"],
    logo: "https://picsum.photos/seed/healthwellness/200/200",
    totalUsers: 2200,
    onlineUsers: 125,
    owner: "Dr. Emily Green",
    createdAt: "2019-08-20",
  },
  {
    title: "Green Earth Alliance",
    description: "Advocating for environmental sustainability.",
    tags: ["environment", "sustainability", "nature"],
    logo: "https://picsum.photos/seed/greenearth/200/200",
    totalUsers: 3300,
    onlineUsers: 210,
    owner: "John Doe",
    createdAt: "2021-03-10",
  },
  {
    title: "Book Lovers Club",
    description: "A place for book enthusiasts to share and discuss.",
    tags: ["books", "reading", "literature"],
    logo: "https://picsum.photos/seed/booklovers/200/200",
    totalUsers: 1500,
    onlineUsers: 80,
    owner: "Sarah Blake",
    createdAt: "2022-01-05",
  },
  {
    title: "Fitness Warriors",
    description: "Dedicated to achieving fitness goals together.",
    tags: ["fitness", "exercise", "workout"],
    logo: "https://picsum.photos/seed/fitnesswarriors/200/200",
    totalUsers: 2900,
    onlineUsers: 400,
    owner: "Mike Carter",
    createdAt: "2020-11-15",
  },
  {
    title: "Art Enthusiasts",
    description: "Celebrating art in all its forms.",
    tags: ["art", "painting", "creativity"],
    logo: "https://picsum.photos/seed/artenthusiasts/200/200",
    totalUsers: 2100,
    onlineUsers: 150,
    owner: "Laura White",
    createdAt: "2018-07-30",
  },
  {
    title: "Code Masters",
    description: "For developers to connect, learn, and grow.",
    tags: ["programming", "coding", "developers"],
    logo: "https://picsum.photos/seed/codemasters/200/200",
    totalUsers: 4300,
    onlineUsers: 500,
    owner: "James Miller",
    createdAt: "2017-09-01",
  },
  {
    title: "Travel Nomads",
    description: "A hub for avid travelers and adventurers.",
    tags: ["travel", "adventure", "exploration"],
    logo: "https://picsum.photos/seed/travelnomads/200/200",
    totalUsers: 1700,
    onlineUsers: 90,
    owner: "Anna Taylor",
    createdAt: "2021-12-10",
  },
  {
    title: "Gaming Legends",
    description: "The ultimate gaming community.",
    tags: ["gaming", "esports", "video games"],
    logo: "https://picsum.photos/seed/gaminglegends/200/200",
    totalUsers: 8000,
    onlineUsers: 1000,
    owner: "Chris Lee",
    createdAt: "2016-04-25",
  },
  {
    title: "Foodies United",
    description: "Sharing recipes and food adventures.",
    tags: ["food", "recipes", "cooking"],
    logo: "https://picsum.photos/seed/foodiesunited/200/200",
    totalUsers: 2600,
    onlineUsers: 180,
    owner: "Sophia Brown",
    createdAt: "2019-02-14",
  },
  {
    title: "Pet Lovers Community",
    description: "For those who adore their furry friends.",
    tags: ["pets", "animals", "care"],
    logo: "https://picsum.photos/seed/petlovers/200/200",
    totalUsers: 3500,
    onlineUsers: 220,
    owner: "David Kim",
    createdAt: "2020-06-30",
  },
  {
    title: "Photography Circle",
    description: "Capturing moments one click at a time.",
    tags: ["photography", "camera", "art"],
    logo: "https://picsum.photos/seed/photographycircle/200/200",
    totalUsers: 3100,
    onlineUsers: 240,
    owner: "Olivia Adams",
    createdAt: "2018-03-18",
  },
  {
    title: "Music Makers",
    description: "Creating and sharing music together.",
    tags: ["music", "instruments", "bands"],
    logo: "https://picsum.photos/seed/musicmakers/200/200",
    totalUsers: 4000,
    onlineUsers: 300,
    owner: "Liam Clark",
    createdAt: "2019-10-12",
  },
  {
    title: "Entrepreneurs' Hub",
    description: "Supporting budding entrepreneurs.",
    tags: ["business", "startups", "networking"],
    logo: "https://picsum.photos/seed/entrepreneurshub/200/200",
    totalUsers: 2600,
    onlineUsers: 140,
    owner: "Lucas Thompson",
    createdAt: "2020-10-05",
  },
  {
    title: "Tech Titans",
    description: "A community of tech leaders.",
    tags: ["technology", "leadership", "innovation"],
    logo: "https://picsum.photos/seed/techtitans/200/200",
    totalUsers: 6700,
    onlineUsers: 720,
    owner: "Isabella Anderson",
    createdAt: "2015-09-12",
  },
];




export default function () {

  const [organizations, setOrganizations] = useRecoilState<OrganizationType[] | []>(organizationsAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useRecoilValue(userSessionAtom);
  const [displayType, setDisplayType] = useRecoilState<DisplayType>(allOrganizationDisplaytype);

  useEffect(() => {
    const fetchCall = async () => {
      setLoading(true);
      await new Promise(t => setTimeout(t, 500));
      if (session.user?.token) {
        const data = await fetchAllOrganization(session.user.token);
        setOrganizations(data);
      }
      setLoading(false);
    }
    fetchCall();
  }, [session.user?.token]);


  return (
    <div className="bg-[#37474f] dark:bg-[#141313] h-full relative flex flex-col">
      <div className="flex flex-row items-center gap-x-3 px-2 py-1 absolute top-6 right-12 dark:bg-zinc-600/30 rounded-[4px]">
        <HiViewGridAdd onClick={() => setDisplayType(DisplayType.grid)} size={22} className="text-zinc-400" />
        <FaList onClick={() => setDisplayType(DisplayType.list)} size={19} className="text-zinc-400" />
      </div>
      <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organizations which previously joined">All organizations</DashboardComponentHeading>
      <div className="bg-[#37474f] dark:bg-[#262629] my-8 mx-12 rounded-[8px] shadow-lg shadow-black/40 flex-grow overflow-hidden ">
        {loading ?
          (<HomeOrganizationsSkeleton />) :
          (
            displayType === DisplayType.list ? <ListTypeOrganizations organizations={testOrgs} />
              : <CardHoverChatCards className="py-8" organizations={organizations} />
          )
        }
        {/* <CardHoverChatCards className="py-8" organizations={organizations} /> */}
      </div>
    </div>
  );
}
