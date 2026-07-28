interface JobCardProps {
  title: string;
  company: string;
  description: string;
  hardSkills: string[];
  tools: string[];
  employmentType: string;
  locationRaw: string | null;
  isRemote: boolean;
}

export function JobCard({
  title,
  company,
  description,
  hardSkills,
  tools,
  employmentType,
  locationRaw,
  isRemote,
}: JobCardProps) {
  return (
    <div className="rounded-lg border border-[rgba(246,244,236,0.1)] bg-[rgba(246,244,236,0.03)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-[#F6F4EC]">{title}</h3>
          <p className="text-sm text-[#A8B0C3]">{company}</p>
        </div>

        <span className="shrink-0 rounded-full border border-[rgba(246,244,236,0.15)] px-3 py-1 text-xs text-[#A8B0C3]">
          {employmentType}
        </span>
      </div>

      <p className="mt-3 text-sm text-[#A8B0C3]">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[...hardSkills, ...tools].slice(0, 6).map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded-full bg-[rgba(63,167,150,0.12)] px-3 py-1 text-xs text-[#3FA796]"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-[#A8B0C3]">
        {isRemote ? "Remote" : (locationRaw ?? "Location not specified")}
      </p>
    </div>
  );
}
