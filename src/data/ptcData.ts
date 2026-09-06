import { PTCCampusResource } from "../types";

export const PTC_CAMPUS_INFO = {
  institution: "Pateros Technological College",
  institute: "Institute of Information and Computing Technology (IICT)",
  address: "College St., Sto. Rosario Kanluran, Pateros, Metro Manila, Philippines",
  postalCode: "1620",
  website: "paterostechnologicalcollege.edu.ph",
  motto: "Excellence, Integrity, and Service",
};

export const PTC_RESOURCES: PTCCampusResource[] = [
  {
    id: "ptc-guidance",
    title: "PTC Guidance & Counseling Center (GCC)",
    department: "Office of Student Affairs and Services (OSAS)",
    location: "PTC Main Building, 2nd Floor, Room 204 (College St., Sto. Rosario Kanluran)",
    contactEmail: "guidance@paterostechnologicalcollege.edu.ph",
    contactNumber: "(02) 8642-8896 / Local 105",
    hours: "Monday to Friday: 8:00 AM – 5:00 PM",
    services: [
      "Confidential One-on-One Student Psychological Counseling",
      "Academic Adjustment, Burnout & Study Skills Advising",
      "Mental Health Act (RA 11036) Student Support & Accommodations",
      "CHED Project GROWS & GAYON Guidance Assistance Program",
      "Crisis De-escalation and Professional Referral Support",
    ],
    notes: "Walk-ins are welcomed, or students may schedule confidential sessions in advance without notifying academic instructors.",
  },
  {
    id: "ptc-iict",
    title: "Institute of Information and Computing Technology (IICT)",
    department: "College of Computer Studies / IT Faculty Office",
    location: "PTC IT Building, 3rd Floor Faculty Room",
    contactEmail: "iict@paterostechnologicalcollege.edu.ph",
    contactNumber: "(02) 8642-8896 / Local 112",
    hours: "Monday to Saturday: 8:00 AM – 6:00 PM",
    services: [
      "BSIT Academic Advising & Thesis / Capstone Mentorship",
      "Special Consultation for Overloaded Student Schedules",
      "Peer Tutoring in Programming & Systems Analysis",
      "Special Exam & Project Rescheduling for Medical/Mental Health Reasons",
    ],
    notes: "Your academic advisors can facilitate reasonable assignment extensions under the PTC Student Handbook guidelines.",
  },
  {
    id: "ptc-peer",
    title: "PTC Peer Facilitators & Mental Health Advocates Club",
    department: "Student Supreme Council (SSC) Health & Welfare Committee",
    location: "Student Activity Center (SAC), Ground Floor",
    contactEmail: "peerfacilitators@ptc.edu.ph",
    contactNumber: "(02) 8642-8896 / SSC Desk",
    hours: "Monday to Friday: 10:00 AM – 4:00 PM",
    services: [
      "Student-to-Student Confidential Listening & Empathy Space",
      "Group Study Calm Sessions & De-stress Workshops",
      "Exam Week Snack & Mindful Recharge Lounges",
    ],
    notes: "Led by trained fellow PTC students offering compassionate peer encouragement.",
  },
  {
    id: "ptc-clinic",
    title: "PTC Campus Medical Clinic",
    department: "Health and Wellness Services",
    location: "Main Building, Ground Floor (Beside Registrar)",
    contactEmail: "clinic@paterostechnologicalcollege.edu.ph",
    contactNumber: "(02) 8642-8896 / Local 102",
    hours: "Monday to Friday: 7:30 AM – 6:00 PM",
    services: [
      "Acute Physical Distress & Panic Attack First-Aid Assistance",
      "Resting Cubicles for Exhausted or Ill Students",
      "Emergency Transport Referral to Pateros District Hospital",
    ],
    notes: "Free basic medical assessment and resting area for all enrolled PTC students.",
  },
];

export const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things or college coursework?",
  "Feeling down, depressed, or hopeless about your studies or future?",
  "Trouble falling or staying asleep, or sleeping too much during the academic week?",
  "Feeling tired, sluggish, or having little energy for lectures and assignments?",
  "Poor appetite or overeating during exam periods and late-night study?",
  "Feeling bad about yourself — or that you are a failure or have let your family or PTC community down?",
  "Trouble concentrating on things, such as reading textbooks, coding, or attending lectures?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?",
  "Thoughts that you would be better off not being here, or of hurting yourself in some way?",
];

export const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, on edge, or overwhelmed by academic deadlines?",
  "Not being able to stop or control worrying about grades, exams, or thesis defense?",
  "Worrying too much about different campus and personal matters?",
  "Trouble relaxing, even after completing homework or during weekends?",
  "Being so restless that it is hard to sit still during lectures or study sessions?",
  "Becoming easily annoyed or irritable with classmates, professors, or groupmates?",
  "Feeling afraid, as if something awful might happen regarding your college standing?",
];

export const COGNITIVE_DISTORTIONS = [
  {
    name: "Catastrophizing (Fortune Telling)",
    description: "Assuming the worst possible outcome will occur (e.g., 'If I fail this quiz, I will drop out of PTC and ruin my entire IT career').",
  },
  {
    name: "All-or-Nothing (Black-and-White)",
    description: "Viewing situations in rigid binaries (e.g., 'If I don't get a 1.0 or 1.25 grade, I'm completely worthless as an IT student').",
  },
  {
    name: "Mind Reading",
    description: "Assuming instructors or college peers think negatively of you without evidence (e.g., 'The professor thinks I am unintelligent because I asked a question').",
  },
  {
    name: "Overgeneralization",
    description: "Taking a single negative college setback and applying it to everything (e.g., 'My code had bugs today, I'm simply bad at technology').",
  },
  {
    name: "Emotional Reasoning",
    description: "Assuming your current intense feeling represents objective truth (e.g., 'I feel overwhelmed right now, which means I cannot handle college').",
  },
  {
    name: "Disqualifying the Positive",
    description: "Downplaying your legitimate academic successes (e.g., 'I only passed the midterms because the exam was easy, not because I worked hard').",
  },
];
