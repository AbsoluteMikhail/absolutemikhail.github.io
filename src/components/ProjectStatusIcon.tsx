import { Hammer, Rocket, Snowflake, type LucideProps } from "lucide-react";

interface ProjectStatusIconProps extends LucideProps {
  status: string;
}

const ProjectStatusIcon = ({ status, ...props }: ProjectStatusIconProps) => {
  const Icon = status === "В релизе"
    ? Rocket
    : status === "Заморожен"
      ? Snowflake
      : Hammer;

  return <Icon aria-hidden="true" {...props} />;
};

export default ProjectStatusIcon;
