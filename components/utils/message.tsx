import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

type MessageProps = {
  Icon: React.ReactNode;
  description: string | React.ReactNode;
  children?: React.ReactNode;
};

export default function Message({ Icon, description, children }: MessageProps) {
  return (
    <div className="flex items-center justify-center my-20">
      <Card className="w-full max-w-md mx-auto bg-transparent shadow-none border-0 flex flex-col gap-3 justify-center">
        <CardHeader>
          {Icon}
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
