import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface FileUploadProps {
  onChange: Dispatch<SetStateAction<FileList>>;
  value?: FileList;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange, value, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    // Convert File[] to FileList
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    onChange(dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  const file = value?.[0];

  return (
    <div className="w-28">
      <div {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            aria-label="Upload image"
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                onChange(e.target.files);
              }
            }}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center w-32">
            <div className="relative w-full">
              {file ? (
                <motion.div
                  layoutId="file-upload"
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4 text-xs">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    layoutId="file-upload"
                    variants={mainVariant}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={cn(
                      "relative group-hover/file:shadow-2xl z-40  bg-white dark:bg-zinc-900/80  flex items-center justify-center h-20 w-20 mt-4 rounded-md",
                      "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                    )}
                  >
                    {isDragActive ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-600 flex flex-col items-center"
                      >
                        Drop it
                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      </motion.p>
                    ) : (
                      <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    )}
                  </motion.div>

                  <motion.div
                    variants={secondaryVariant}
                    className="absolute opacity-0 border border-dashed border-sky-500 inset-0 z-30 bg-transparent flex items-center justify-center mt-4 w-20 h-20 rounded-md"
                  ></motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};