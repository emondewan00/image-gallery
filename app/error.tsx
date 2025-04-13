"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-dvh flex items-center justify-center flex-col bg-slate-900 text-white gap-2">
      <h2>Oops went wrong!</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded "
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
