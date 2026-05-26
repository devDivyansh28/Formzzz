
import Image from "next/image";

import { getUser } from "~/hooks/api/auth";

type User = {
  email: string;
  fullName: string;
  profileImageUrl?: string | null;
};

export default function UserInfo() {

    const {userInfo} = getUser()


  // Example user data
  const user: User = {
    email: userInfo?.email ?? "",
    fullName: userInfo?.fullName ?? "John Doe",
    profileImageUrl: userInfo?.profileImageUrl ?? "",
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Image */}
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={user.fullName}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-[120px] w-[120px] rounded-full bg-muted" />
          )}

          {/* Full Name */}
          <h1 className="text-2xl font-bold">{user.fullName}</h1>

          {/* Email */}
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </main>
  );
}
