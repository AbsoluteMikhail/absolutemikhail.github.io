import { instructorBadgeNotice, instructorBadgeNoticeId } from "@/constants/instructorBadge";
import { cn } from "@/lib/utils";

const InstructorBadgeNotice = ({ className }: { className?: string }) => (
  <p
    id={instructorBadgeNoticeId}
    tabIndex={-1}
    className={cn("scroll-mt-24 text-sm leading-6 text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary", className)}
  >
    <span aria-hidden="true">* </span>{instructorBadgeNotice}
  </p>
);

export default InstructorBadgeNotice;
