import { SiweStatus } from "@/src/components/siwe-status";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] items-center justify-center">
        <SiweStatus />
      </div>
    </main>
  );
}
