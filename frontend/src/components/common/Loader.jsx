import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="relative">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-primary-500/20"></div>
      </div>
      <p className="text-sm text-surface-500">{text}</p>
    </div>
  );
}
