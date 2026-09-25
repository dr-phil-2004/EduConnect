import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Spinner className="h-12 w-12 mb-4 mx-auto" />
        <p className="text-gray-600">Chargement…</p>
      </div>
    </div>
  );
}
