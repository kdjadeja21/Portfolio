import { SiCursor } from "react-icons/si";

type CursorMarkProps = {
  className?: string;
};

export default function CursorMark({ className }: CursorMarkProps) {
  return <SiCursor className={className} aria-hidden />;
}
