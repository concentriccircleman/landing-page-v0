import Link from "next/link";
import { ibmPlexMono } from "@/utils/fonts";

interface CareersRole {
  title: string;
  location: string;
  department: string;
  ashbyUrl: string;
}

const CAREERS_ROLES: CareersRole[] = [
  {
    title: "Senior Backend Software Engineer",
    location: "San Francisco / Bay Area",
    department: "Engineering",
    ashbyUrl: "https://jobs.ashbyhq.com/sentra/70005074-668c-4c71-929c-2a17cfaa081e",
  },
  {
    title: "Senior Frontend Software Engineer",
    location: "San Francisco / Bay Area",
    department: "Engineering",
    ashbyUrl: "https://jobs.ashbyhq.com/sentra/876c37ad-1289-425a-b658-7f478c100bd6",
  },
  {
    title: "Software Engineer - Internship",
    location: "San Francisco / Bay Area",
    department: "Engineering",
    ashbyUrl: "https://jobs.ashbyhq.com/sentra/eb51547f-e234-42f7-ab75-ab93717579d9",
  },
  {
    title: "Software Engineer - New Grad",
    location: "San Francisco / Bay Area",
    department: "Engineering",
    ashbyUrl: "https://jobs.ashbyhq.com/sentra/3c9729ca-67b3-4f9f-9c64-5e1e10be1719",
  },
  {
    title: "Machine Learning Research Scientist",
    location: "San Francisco / Bay Area",
    department: "Research",
    ashbyUrl: "https://jobs.ashbyhq.com/sentra/03976429-eb79-48df-8439-29f0cdaba859",
  },
];

const Careers = () => {
  return (
    <section className="w-full px-4">
      <h1 className="text-3xl/snug font-medium tracking-tight text-foreground">
        Careers
      </h1>

      <div className="mt-6 space-y-10">
        <div className="w-full">
          <ul className="w-full space-y-2">
            {CAREERS_ROLES.map((careersRole) => (
              <li key={careersRole.title}>
                <Link
                  href={careersRole.ashbyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3 sm:-mx-4 sm:px-4 sm:hover:bg-foreground/5 sm:transition-colors"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <div className="text-sm font-medium text-foreground sm:flex-1">
                      {careersRole.title}
                    </div>
                    <div className="text-sm text-foreground/70 sm:w-56 sm:shrink-0">
                      {careersRole.location}
                    </div>
                    <div
                      className={`text-sm text-secondary sm:hover:text-foreground sm:transition-colors sm:ml-auto sm:w-40 sm:shrink-0 sm:text-right ${ibmPlexMono.className}`}
                    >
                      {careersRole.department}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Careers;

