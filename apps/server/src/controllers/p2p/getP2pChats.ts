import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getP2pChats(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "You are not authorized" });
    return;
  }

  const user2_username = req.params.username;

  try {
    const user2 = await prisma.users.findUnique({
      where: { username: user2_username }
    });

    if (!user2) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const user1id = req.user.id;
    const user2id = user2.id;

    const p2pChats = await prisma.chatMessageOneToOne.findMany({
      where: {
        OR: [
          { senderId: user1id, receiverId: user2id },
          { senderId: user2id, receiverId: user1id }
        ]
      },
      include: {
        sender: true,
        receiver: true
      },
      orderBy: { created_at: 'asc' }
    });

    res.status(200).json({
      message: "Successfully fetched all chats",
      data: p2pChats
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in fetching chats' });
    return;
  }
}
