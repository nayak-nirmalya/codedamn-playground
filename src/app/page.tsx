import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">
        Hello World! (Landing Page | Not Protected)
      </h1>
      <a href="/dashboard" className="text-lg underline font-bold">
        Dashboard
      </a>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode="modal"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </SignedOut>
    </main>
  );
}
