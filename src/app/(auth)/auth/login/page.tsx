import Image from "next/image";
import { redirect } from "next/navigation";

import { UserAuthLoginForm } from "@/components/auth/user-login-form";
import { auth } from "@/server/auth";

export default async function LoginPage() {
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
          src={process.env.LOGIN_IMAGE ?? "/placeholder.svg"}
          alt="Image"
          width="1920"
          height="1080"
          className="h-screen w-full rounded-l-2xl object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}
