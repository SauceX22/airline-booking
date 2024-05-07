"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MotionButton } from "@/components/ui/motion-button";
import { newCardFormSchema } from "@/lib/validations/general";
import { api } from "@/trpc/client";

type FormData = z.infer<typeof newCardFormSchema>;

export default function NewCardDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const newCardForm = useForm<FormData>({
    resolver: zodResolver(newCardFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "My Card",
      number: "0123456789123456",
      expiry: "12/24",
      cvc: "123",
    },
  });

  const apiUtils = api.useUtils();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
  } = newCardForm;

  const { mutateAsync: createCard, isLoading } =
    api.creditCard.create.useMutation({
      onError(err) {
        setIsOpen(false);
        toast.error("Something went wrong.", {
          description: err.message,
        });
      },
      async onSuccess(data, variables, context) {
        setIsOpen(false);
        toast.success("Card added successfully!", {
          description: "The card has been successfully added.",
        });

        await apiUtils.creditCard.invalidate();
        router.refresh();
      },
    });

  async function onSubmit(data: FormData) {
    await createCard(data);
  }

  return (
    <Dialog key="new-card-dialog" open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2 h-24 w-full border-dashed" variant="outline">
          <PlusIcon className="mr-2 h-6 w-6" />
          Add New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Payment Card</DialogTitle>
          <DialogDescription>
            Enter your new card details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCardForm}>
          <form>
            <FormField
              control={newCardForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="name">Name on Card</FormLabel>
                  <FormControl id="name">
                    <Input
                      type="name"
                      id="name"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      placeholder="Enter card name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={newCardForm.control}
              name="number"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="number">Card Number</FormLabel>
                  <FormControl id="number">
                    <Input
                      type="number"
                      id="number"
                      autoCapitalize="words"
                      autoComplete="number"
                      autoCorrect="off"
                      placeholder="Enter card number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.number?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={newCardForm.control}
              name="expiry"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="expiry">Expires</FormLabel>
                  <FormControl id="expiry">
                    <Input
                      type="expiry"
                      id="expiry"
                      autoCapitalize="words"
                      autoComplete="expiry"
                      autoCorrect="off"
                      placeholder="MM/YY"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.expiry?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={newCardForm.control}
              name="cvc"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="cvc">CVC</FormLabel>
                  <FormControl id="cvc">
                    <Input
                      type="cvc"
                      id="cvc"
                      autoCapitalize="words"
                      autoComplete="cvc"
                      autoCorrect="off"
                      placeholder="CVC"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.cvc?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <MotionButton
            className="w-full"
            onClick={async (e) => {
              e.preventDefault();
              await handleSubmit(onSubmit)();
            }}
            isLoading={isLoading}>
            Add Card
          </MotionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
