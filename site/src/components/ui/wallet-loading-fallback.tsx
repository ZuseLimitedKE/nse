import { Spinner } from "@/components/ui/spinner";
export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex  justify-center">
      <div className="flex  text-2xl  items-center gap-2">
        <Spinner size="large" />
        Loading
      </div>
    </div>
  );
}
