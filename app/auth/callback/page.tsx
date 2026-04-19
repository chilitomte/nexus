import { Suspense } from "react";
import { CallbackClient } from "./CallbackClient";

function CallbackFallback() {
  return (
    <div className="glass-panel space-y-8 p-6 text-center sm:p-8">
      <p className="text-lg text-white">Opening the portal...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackClient />
    </Suspense>
  );
}
