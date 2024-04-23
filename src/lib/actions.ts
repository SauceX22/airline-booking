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
 * @param callbackUrl The url to redirect to after the search
 * @returns void
 */
export async function searchAction(
  data: z.infer<typeof filterFormSchema>,
  callbackUrl: string,
) {
  let url = callbackUrl;

  if (data.query) {
    if (data.queryType) {
      url += `?query=${data.query}&queryType=${data.queryType}`;
    } else {
      url += `?query=${data.query}&queryType=all`;
    }
  }

  if (data.doa?.from && data.doa?.to) {
    url += `${data.query ? "&" : "?"}doaFrom=${data.doa.from.toISOString()}&doaTo=${data.doa.to.toISOString()}`;
  }
  return redirect(url);
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
