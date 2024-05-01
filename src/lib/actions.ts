"use server";
import { type filterFormSchema } from "@/lib/validations/general";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { type z } from "zod";

/**
 * Search server action to redirect to the callback url with the search params
 *
 * read more about server actions here: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 *
 * @param data The form data to be submitted
 * @param callbackPath The url to redirect to after the search
 * @returns void
 */
export async function searchAction(
  data: z.infer<typeof filterFormSchema>,
  callbackPath: string,
) {
  // dummy url to create the object (removed at the end)
  const url = new URL("http://dummy.com" + callbackPath);

  // set params
  const current = url.searchParams;
  if (data.source) current.set("source", data.source);
  if (data.dest) current.set("dest", data.dest);
  if (data.date) current.set("date", data.date.toISOString());
  url.search = current.toString();

  // remove empty params
  const params = url.searchParams;
  for (const [key, value] of params) {
    if (!value || value === "" || value === "any") params.delete(key);
  }

  // remove the dummy domain "http://dummy.com"
  const redirectUrl = url.pathname + url.search;

  return redirect(redirectUrl);
}

/**
 * Server action to revalidate the cache of a path after a relevant mutation
 *
 * @param path path to revalidate the cache of
 * @returns void
 */
export async function revalidatePathCache(path: string) {
  return revalidatePath(path);
}
