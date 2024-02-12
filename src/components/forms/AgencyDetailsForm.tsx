"use client";
import { Agency } from "@prisma/client";
import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { NumberInput } from "@tremor/react";
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { v4 } from "uuid";
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
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      zipCode: data?.zipCode,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });
  // by default react hook form caches the values and does not update the form
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserDta;
      let customerId;
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          phone: values.companyPhone,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        };
      }

      newUserDta = await initUser({ role: "AGENCY_OWNER" });
      if (!data?.id) {
        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });

        toast({
          title: "Created Agency",
        });
        if (data?.id) return router.refresh();
        if (response) {
          return router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again",
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    try {
      const response = await deleteAgency(data.id);
      toast({
        title: "Agency Deleted",
        description: "The agency and Sub Accounts have been deleted",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again",
      });
      setDeletingAgency(false);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full mt-3">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for your bussiness. You can edit your agency
            later from the agency settings tab
          </CardDescription>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="agencyLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Logo</FormLabel>
                      <FormControl>
                        <FileUpload
                          apiEndpoint="agencyLogo"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Agency Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Agency Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Agency Email</FormLabel>
                        <FormControl>
                          <Input readOnly placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Company Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Company Phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="whiteLabel"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-center rounded-lg border gap-4 p-4">
                        <div>
                          <FormLabel>Whitelabel Agency</FormLabel>
                          <FormDescription>
                            Turning on whitelabel will show your agency logo to
                            all sub accounts by default. You can overwrite this
                            functionality through sub account settings.
                          </FormDescription>
                        </div>
                        <div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 st..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex md:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Zipcpde</FormLabel>
                        <FormControl>
                          <Input placeholder="Zipcode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {data?.id && (
                  <div className="flex flex-col gap-2">
                    <FormLabel>Create A Goal</FormLabel>
                    <FormDescription>
                      {`✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!`}
                    </FormDescription>
                    <NumberInput
                      defaultValue={data?.goal}
                      onValueChange={async (val: number) => {
                        if (!data?.id) return;
                        await updateAgencyDetails(data.id, { goal: val });
                        await saveActivityLogsNotification({
                          agencyId: data.id,
                          description: `Updated the agency goal to | ${val} Sub Account`,
                          subAccountId: undefined,
                        });
                        router.refresh();
                      }}
                      min={1}
                      className="bg-background !border !border-input"
                      placeholder="Sub Account Goal"
                    />
                  </div>
                )}
                <Button type="submit">
                  {isLoading ? <Loading /> : "Save Agency Details"}
                </Button>
              </form>
            </Form>
            {data?.id && (
              <div>
                <div className="flex items-center flex-row justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                  <div>
                    <div>Danger Zone</div>
                    <div className="text-muted-foreground">
                      Deleting an agency will delete all sub accounts and their
                      data. This action is irreversible. Sub accounts will no
                      longer have access to funnels, automations, and other
                      data.
                    </div>
                  </div>
                </div>

                <AlertDialogTrigger
                  disabled={isLoading || deletingAgency}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingAgency ? "Deleting..." : "Delete Agency"}
                </AlertDialogTrigger>
              </div>
            )}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-left">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  This action cannot be undone. This will permanently delete the
                  Agency account and all related sub accounts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deletingAgency}
                  className="bg-destructive hover:bg-destructive"
                  onClick={handleDeleteAgency}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </CardContent>
        </CardHeader>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetailsForm;
