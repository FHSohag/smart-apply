import { createJobPosting, saveJobEmbedding } from "@/services/job-posting.service";
import { generateJobEmbedding } from "@/services/embedding.service";
import type { CreateJobPostingInput } from "@/services/job-posting.service";

const jobPostings: CreateJobPostingInput[] = [
  // ── Strong matches: Frontend Developer resume ──
  {
    title: "Junior Frontend Developer",
    company: "PixelCraft Studio",
    description:
      "We're looking for a junior frontend developer to join our product team, building responsive web applications with React and Next.js. You'll work closely with designers to implement clean, component-based UIs and integrate with REST APIs.",
    hardSkills: ["React.js", "Next.js", "JavaScript", "HTML5", "CSS3", "Component-based architecture", "State management"],
    tools: ["Tailwind CSS", "Git", "GitHub"],
    softSkills: ["Attention to detail", "Collaboration"],
    languages: [],
    minExperienceYears: 0,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Frontend Engineer (Remote)",
    company: "Northwind Software",
    description:
      "Join our fully remote engineering team building a SaaS dashboard product. Strong React fundamentals required, Next.js experience a plus. You'll own features end-to-end from design handoff to deployment.",
    hardSkills: ["React.js", "Next.js", "JavaScript", "Data Structures"],
    tools: ["Firebase", "Git"],
    softSkills: ["Self-directed", "Communication"],
    languages: ["English"],
    minExperienceYears: 1,
    employmentType: "full-time",
    locationRaw: null,
    locationCity: null,
    locationCountry: null,
    isRemote: true,
  },
  {
    title: "Full Stack Developer",
    company: "Bhalo Tech Ltd.",
    description:
      "Growing local startup seeking a full stack developer comfortable across React frontend and Node.js backend. You'll build and maintain internal tools and customer-facing features for our platform.",
    hardSkills: ["React.js", "Next.js", "Node.js", "JavaScript"],
    tools: ["Firebase", "Git", "GitHub"],
    softSkills: ["Problem-solving"],
    languages: [],
    minExperienceYears: 1,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },

  // ── Strong matches: Teaching / Tutoring resume ──
  {
    title: "Biology & Chemistry Teacher",
    company: "Greenview International School",
    description:
      "Seeking a passionate science educator to teach Biology and Chemistry at the secondary level. Candidate should have strong subject knowledge and the ability to design engaging lesson plans for students of varying levels.",
    hardSkills: ["Biology", "Chemistry", "Biochemistry", "Lesson Planning", "Subject Knowledge"],
    tools: ["MS Office"],
    softSkills: ["Communication", "Patience", "Student Engagement"],
    languages: ["Bengali", "English"],
    minExperienceYears: 0,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Private Tutor — Science Subjects",
    company: "BrightPath Tutoring",
    description:
      "We connect qualified tutors with students needing one-on-one support in Biology, Chemistry, and General Science, from basic to intermediate levels. Flexible scheduling, in-person sessions in Dhaka.",
    hardSkills: ["Biology", "Chemistry", "General Science"],
    tools: [],
    softSkills: ["Communication", "Problem Solving", "Time Management"],
    languages: ["Bengali", "English"],
    minExperienceYears: 0,
    employmentType: "part-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Teaching Assistant, Biochemistry Department",
    company: "North South University",
    description:
      "Seeking a teaching assistant to support undergraduate Biochemistry and Biotechnology courses — grading, lab supervision, and student support. Strong academic background in the field required.",
    hardSkills: ["Biochemistry", "Biotechnology", "Subject Knowledge"],
    tools: [],
    softSkills: ["Communication", "Student Engagement"],
    languages: ["English"],
    minExperienceYears: 0,
    employmentType: "part-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },

  // ── Strong matches: Business / Fresher resume ──
  {
    title: "Junior Accountant",
    company: "Meridian Financial Services",
    description:
      "Entry-level accounting role supporting the finance team with bookkeeping, reconciliation, and financial reporting. Fresh graduates in Accounting or Finance encouraged to apply.",
    hardSkills: ["Accounting", "Finance"],
    tools: ["MS Office (Excel, Word, PowerPoint)"],
    softSkills: ["Time management", "Client handling"],
    languages: [],
    minExperienceYears: 0,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Business Development Executive (Fresher)",
    company: "Orbit Marketing Group",
    description:
      "Looking for an energetic fresher to join our business development team, handling client outreach, social media marketing campaigns, and relationship management. Strong communication skills essential.",
    hardSkills: ["Business Studies", "Social Media Marketing"],
    tools: ["Canva", "Google Workplace", "MS Office"],
    softSkills: ["Communication (written & verbal)", "Leadership", "Client handling"],
    languages: [],
    minExperienceYears: 0,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Finance Associate — Entry Level",
    company: "Summit Capital Advisors",
    description:
      "Entry-level finance role assisting with financial modeling, reporting, and client account management. BBA or related degree required; fresh graduates welcome.",
    hardSkills: ["Finance", "Accounting", "Commerce"],
    tools: ["MS Office (Excel, Word, PowerPoint)"],
    softSkills: ["Problem-solving", "Learning mindset"],
    languages: [],
    minExperienceYears: 0,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },

  // ── Deliberate mismatches (should score low across all three resumes) ──
  {
    title: "Senior Backend Engineer",
    company: "CloudScale Systems",
    description:
      "We need a senior backend engineer with deep expertise in distributed systems, to lead the architecture of our microservices platform handling millions of requests daily.",
    hardSkills: ["Go", "Kubernetes", "Distributed Systems", "Microservices Architecture"],
    tools: ["Docker", "Terraform", "AWS"],
    softSkills: ["Leadership", "Mentorship"],
    languages: ["English"],
    minExperienceYears: 8,
    employmentType: "full-time",
    locationRaw: null,
    locationCity: null,
    locationCountry: null,
    isRemote: true,
  },
  {
    title: "Civil Engineer",
    company: "Nirman Construction Ltd.",
    description:
      "Seeking a licensed civil engineer to oversee structural design and site supervision for commercial construction projects in Chittagong.",
    hardSkills: ["Structural Engineering", "AutoCAD", "Site Supervision"],
    tools: ["AutoCAD", "Civil 3D"],
    softSkills: ["Attention to detail"],
    languages: ["Bengali"],
    minExperienceYears: 3,
    employmentType: "full-time",
    locationRaw: "Chittagong, Bangladesh",
    locationCity: "Chittagong",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Registered Nurse",
    company: "Apollo Hospitals Dhaka",
    description:
      "Seeking a licensed registered nurse for our inpatient care unit. Must have clinical experience and current nursing registration.",
    hardSkills: ["Patient Care", "Clinical Nursing", "Medication Administration"],
    tools: [],
    softSkills: ["Empathy", "Attention to detail"],
    languages: ["Bengali", "English"],
    minExperienceYears: 2,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Senior Data Scientist",
    company: "Vantage Analytics",
    description:
      "Looking for a senior data scientist with a strong research background to lead machine learning initiatives across our product suite. PhD or equivalent research experience strongly preferred.",
    hardSkills: ["Machine Learning", "Deep Learning", "Statistical Modeling", "Python"],
    tools: ["PyTorch", "TensorFlow", "SQL"],
    softSkills: ["Research", "Leadership"],
    languages: ["English"],
    minExperienceYears: 6,
    employmentType: "full-time",
    locationRaw: null,
    locationCity: null,
    locationCountry: null,
    isRemote: true,
  },
  {
    title: "Mechanical Engineer",
    company: "Ferro Industries",
    description:
      "Manufacturing plant seeking a mechanical engineer to oversee equipment maintenance and process optimization on the production floor.",
    hardSkills: ["Mechanical Design", "Process Optimization", "Equipment Maintenance"],
    tools: ["SolidWorks", "AutoCAD"],
    softSkills: ["Problem-solving"],
    languages: ["Bengali"],
    minExperienceYears: 4,
    employmentType: "full-time",
    locationRaw: "Chittagong, Bangladesh",
    locationCity: "Chittagong",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
  {
    title: "Graphic Designer",
    company: "InkWell Creative Agency",
    description:
      "Seeking a graphic designer with a strong portfolio to create marketing materials, social media content, and brand assets for our clients.",
    hardSkills: ["Graphic Design", "Visual Design", "Branding"],
    tools: ["Canva", "Adobe Photoshop", "Adobe Illustrator"],
    softSkills: ["Creativity"],
    languages: [],
    minExperienceYears: 1,
    employmentType: "full-time",
    locationRaw: "Dhaka, Bangladesh",
    locationCity: "Dhaka",
    locationCountry: "Bangladesh",
    isRemote: false,
  },
];

async function main() {
  console.log(`Seeding ${jobPostings.length} job postings...\n`);

  for (const job of jobPostings) {
    console.log(`Creating: ${job.title} @ ${job.company}`);

    const created = await createJobPosting(job);

    const embedding = await generateJobEmbedding({
      title: job.title,
      description: job.description,
      hardSkills: job.hardSkills,
      tools: job.tools,
      softSkills: job.softSkills,
      minExperienceYears: job.minExperienceYears,
    });

    await saveJobEmbedding(created.id, embedding);

    console.log(`  ✓ Saved with embedding (id: ${created.id})`);
  }

  console.log("\nSeeding complete.");
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});