import { Request, Response } from "express";
import prisma from "@repo/db/client"; // Adjust the import path as necessary
import { fileUploader } from "../utils/cloudinary/fileUploader"; // Adjust the import path as necessary

export default async function updateChatGroup(req: Request, res: Response) {
  try {
    const { id: groupId } = req.params;
    const { title, passcode, icon } = req.body;

    if (!groupId) {
      return res.status(400).json({
        message: "Group ID is required",
      });
    }

    // @ts-ignore - For request files (file uploads)
    const groupPhoto = req?.files?.groupPhoto?.tempFilePath;

    // Initialize an object to hold update data
    const updateData: {
      title?: string;
      passcode?: string;
      groupImage?: string;
    } = {};

    // Conditionally update fields
    if (title) updateData.title = title;
    if (passcode) updateData.passcode = passcode;

    if (groupPhoto) {
      // If a new group photo is uploaded, upload it and update the group image
      const uploadedImage = await fileUploader(groupPhoto);
      updateData.groupImage = uploadedImage.secure_url;
    } else if (icon) {
      // If no new image is uploaded but an icon is provided, update the group image with the icon
      updateData.groupImage = icon;
    }

    // Update the chat group in the database
    const chatGroup = await prisma.chatGroup.update({
      where: { id: groupId },
      data: updateData,
    });

    // Respond with success message and updated chat group data
    return res.status(200).json({
      message: "Chat group updated successfully",
      chatGroup,
    });
  } catch (err) {
    console.error("Error in updating the chat group:", err);
    return res.status(500).json({
      message: "Error in updating the chat group",
    });
  }
}
