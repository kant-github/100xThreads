import { Dispatch, SetStateAction } from "react";

interface Props {
    toggleRoomType: () => void;
    roomType: string;
    setRoomType: Dispatch<SetStateAction<string>>;
  }
  
  const ToggleButton = ({ toggleRoomType, roomType, setRoomType }: Props) => {
    const handleClick = () => {
      toggleRoomType();
      // Optionally update the state here as well if needed, but this should be handled in `toggleRoomType`
      setRoomType(roomType === "recent joined rooms" ? "created by you" : "recent joined rooms");
    };
  
    return (
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleClick}
          className={`w-10 h-5 flex items-center rounded-full p-1 border-[1px] border-zinc-600 ${
            roomType === "recent joined rooms" ? "bg-zinc-900" : "bg-zinc-800"
          }`}
        >
          <div
            className={`w-3 h-3 bg-zinc-300 rounded-full shadow-md transform transition-transform ${
              roomType === "recent joined rooms" ? "translate-x-4" : "translate-x-0.5"
            }`}
          ></div>
        </button>
      </div>
    );
  };
  
  export default ToggleButton;
  