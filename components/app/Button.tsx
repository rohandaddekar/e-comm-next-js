import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AppButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  loading: boolean;
  onClick?: () => void;
  className?: string;
  [x: string]: unknown;
}

const AppButton: React.FC<AppButtonProps> = ({
  type,
  text,
  loading,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {text}
      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
};

export default AppButton;
