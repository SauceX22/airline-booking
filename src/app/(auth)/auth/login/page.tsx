import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { UserAuthLoginForm } from "@/components/auth/user-login-form";

export default async function Dashboard() {
  const session = await auth();

  if (session) {
    // Redirect to the page the user came from
    return redirect("/home");
  }

  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <UserAuthLoginForm />
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full rounded-l-2xl object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
