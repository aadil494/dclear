"use-client";
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import React from "react";

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarOptions,
  sidebarLogo,
  details,
  user,
  id,
}: Props) => {
  return <div>MenuOptions</div>;
};

export default MenuOptions;
