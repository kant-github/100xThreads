import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from "react";
import InputBox from "./InputBox";
import BigBlackButton from "../buttons/BigBlackButton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { clearCache } from "actions/common";
import { toast } from "sonner";
import PhotoUploadIcon from "../ui/PhotoUploadIcon";
import CrossButton from "./CrossButton";
import Spinner from "../loaders/Spinner";
import { CHAT_GROUP } from "@/lib/apiAuthRoutes";
import { OrganizationType } from "types";
import RemoveIconCrossButton from "../ui/RemoveIconCrossButton";

interface Props {
  orgs: OrganizationType;
  editDialogBox: boolean;
  setEditDialogBox: Dispatch<SetStateAction<boolean>>;
}

export default function EditDialogBox({
  orgs,
  editDialogBox,
  setEditDialogBox,
}: Props) {
  const [title, setTitle] = useState("");
  const [passcode, setPasscode] = useState<string | undefined>("");
  const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [icon, setIcon] = useState<string | null>(null);

  const { data: session } = useSession();
  if (!session) {
    return null;
  }

  useEffect(() => {
    if (orgs) {
      setTitle(orgs.name);
      // setPasscode(orgs?.passcode);
    }
  }, [orgs]);

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault(); // Prevents the default form submission
    try {
      setLoading(true);
      const finalPayload = new FormData();
      finalPayload.append("title", title);
      // finalPayload.append("passcode", passcode);
      if (groupPhoto) {
        finalPayload.append("groupPhoto", groupPhoto);
      }
      if (icon) {
        finalPayload.append("icon", icon);
      }

      const { data } = await axios.put(`${CHAT_GROUP}/${orgs.id}`,
        finalPayload,
        {
          headers: {
            authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      clearCache("dashboard");
      toast.success(data.message);
      setEditDialogBox(false);
    } catch (err) {
      console.log("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  if (!orgs) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!editDialogBox ? "hidden" : ""}`}
    >
      <div className="bg-white dark:bg-[#262629] dark:text-gray-200 p-6 rounded-lg shadow-lg max-w-lg relative w-2/6">
        <div className="flex justify-between">
          <p className="text-md font-semibold">
            Update {`${orgs.name.trim()}`}'s title and passcode.
          </p>
          <CrossButton setOpen={setEditDialogBox} />
        </div>
        <div className="text-xs font-thin mb-4 mt-1">
          Share the new passcode for access
        </div>
        <form onSubmit={handleSaveChanges}>
          <div className="flex flex-row items-center gap-x-3">
            <PhotoUploadIcon setIcon={setIcon} setGroupPhoto={setGroupPhoto} />
            <InputBox
              value={title}
              label="Title"
              input={title}
              setInput={setTitle}
            />
          </div>
          <div className="ml-0.5 flex items-center justify-start gap-x-1">
            {groupPhoto ? (
              <span className="text-[10px] text-yellow-500 font-medium max-w-4 overflow-hidden">
                {groupPhoto.name.slice(0, 6)}...
              </span>
            ) : (
              <span className="text-[10px] text-yellow-500">{icon}</span>
            )}
            <RemoveIconCrossButton icon={icon} setIcon={setIcon}/>
          </div>
          <div className="mt-2">
            <InputBox
              type="password"
              label="Passcode"
              input={passcode}
              // setInput={setPasscode}
            />
          </div>
          <div className="w-full pt-4 flex items-center justify-center">
            <BigBlackButton disabled={loading}>
              {loading ? <Spinner /> : "Save Changes"}
            </BigBlackButton>
          </div>
        </form>
      </div>
    </div>
  );
}
