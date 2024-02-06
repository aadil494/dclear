"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "./db";
export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOptions: true,
          SubAccounts: {
            include: {
              SidebarOptions: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });
  return userData;
};
