"use client";
import { Agency } from "@prisma/client";
import React from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/router";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { white } from "tailwindcss/colors";
import { add } from "date-fns";
type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required and should be 2 chars" }),
  companyEmail: z
    .string()
    .email({ message: "Email is required and should be valid" }),
  companyPhone: z
    .string()
    .min(10, { message: "Phone is required and should be 10 chars" }),
  whiteLabel: z.boolean(),
  address: z
    .string()
    .min(2, { message: "Address is required and should be 2 chars" }),
  city: z
    .string()
    .min(2, { message: "City is required and should be 2 chars" }),
  state: z
    .string()
    .min(2, { message: "State is required and should be 2 chars" }),
  zipCode: z
    .string()
    .min(2, { message: "Zip is required and should be 2 chars" }),
  country: z
    .string()
    .min(2, { message: "Country is required and should be 2 chars" }),
  agencyLogo: z
    .string()
    .url({ message: "Logo is required and should be valid" }),
});

const AgencyDetailsForm = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for your bussiness. You can edit your agency
            later from the agency settings tab
          </CardDescription>
          <CardContent>
            <Form></Form>
          </CardContent>
        </CardHeader>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetailsForm;
