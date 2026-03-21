import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/homeProfile.scss"

// ── Icons ──────────────────────────────────────────────────────────────────

const BriefcaseIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
    <path d="M2 12h20" />
  </svg>
)

const GraduationCapIcon = () => (
  <svg
    class="section-icon section-icon-education"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

const GlobeIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const AwardIcon = () => (
  <svg
    class="section-icon section-icon-award"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="m8.5 12.5-1 8 4.5-2.5 4.5 2.5-1-8" />
  </svg>
)

const CalendarIcon = () => (
  <svg class="meta-icon" viewBox="-1 -1 26 26" fill="currentColor" stroke="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3H16V2C16 1.44772 16.4477 1 17 1C17.5523 1 18 1.44772 18 2V3H19C20.6569 3 22 4.34315 22 6V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V6C2 4.34315 3.34315 3 5 3H6V2ZM16 5V6C16 6.55228 16.4477 7 17 7C17.5523 7 18 6.55228 18 6V5H19C19.5523 5 20 5.44772 20 6V9H4V6C4 5.44772 4.44772 5 5 5H6V6C6 6.55228 6.44772 7 7 7C7.55228 7 8 6.55228 8 6V5H16ZM4 11V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V11H4Z"
    />
  </svg>
)

const LocationIcon = () => (
  <svg
    class="meta-icon meta-icon-pin"
    viewBox="-1 -1 18 18"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z"
    />
  </svg>
)

interface MetaRowProps {
  period: string
  location: string
}

const MetaRow = ({ period, location }: MetaRowProps) => (
  <div class="home-meta-row">
    <span class="home-meta-item">
      <CalendarIcon />
      <span>{period}</span>
    </span>
    <span class="home-meta-item">
      <LocationIcon />
      <span>{location}</span>
    </span>
  </div>
)

// ── Data ───────────────────────────────────────────────────────────────────

interface ExperienceItem {
  role: string
  company: string
  companyUrl: string
  logo: string
  period: string
  location: string
  description: string
  tags?: string[]
}

interface EducationItem {
  degree: string
  institution: string
  institutionUrl: string
  logo: string
  period: string
  location: string
}

interface Language {
  flag: string
  name: string
  level: string
}

interface AwardItem {
  title: string
  logo: string
  description: string
}

const experience: ExperienceItem[] = [
  {
    role: "Product Development Engineer",
    company: "MIXI, Inc",
    companyUrl: "https://mixi.co.jp",
    logo: "/static/logos/mixi.svg",
    period: "Jan 2026 – Apr 2026",
    location: "Tokyo, Japan",
    description:
      "Building and optimizing iOS features for FamilyAlbum, a photo-sharing platform with 27M+ users across 175 countries, used by 60% of parents in Japan.",
    tags: ["Swift", "iOS", "Agile"],
  },
  {
    role: "Google Student Ambassador",
    company: "Google Japan",
    companyUrl: "https://about.google/intl/ALL_jp/",
    logo: "/static/logos/google.svg",
    period: "Aug 2025 – Feb 2026",
    location: "Tokyo, Japan",
    description:
      "Participated in Google Japan's ambassador program to promote responsible and effective AI use among university students.",
    tags: ["AI", "Gemini"],
  },
]

const education: EducationItem[] = [
  {
    degree: "B.A. Language and Area Studies",
    institution: "Tokyo University of Foreign Studies",
    institutionUrl: "https://www.tufs.ac.jp/english/",
    logo: "/static/logos/Logo_tufs-cropped.svg",
    period: "2024 – 2028",
    location: "Tokyo, Japan",
  },
  {
    degree: "Computer Software Engineering",
    institution: "École 42",
    institutionUrl: "https://42.fr",
    logo: "/static/logos/42.svg",
    period: "2022 – 2025",
    location: "Tokyo, Japan",
  },
]

const awards: AwardItem[] = [
  {
    title: "MEXT Undergraduate Scholarship",
    logo: "/static/logos/mext.svg",
    description:
      "Awarded by the Japanese Government through embassy recommendation for undergraduate studies in Japan.",
  },
]

const languages: Language[] = [
  { flag: "🇧🇷", name: "Portuguese", level: "Native" },
  { flag: "🇯🇵", name: "Japanese", level: "Bilingual" },
  { flag: "🇺🇸", name: "English", level: "Bilingual" },
  { flag: "🇪🇸", name: "Spanish", level: "Professional" },
  { flag: "🇨🇳", name: "Mandarin", level: "Conversational" },
]

// ── Component ──────────────────────────────────────────────────────────────

const HomeProfile: QuartzComponent = () => {
  return (
    <div class="home-profile">
      {/* Experience */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <BriefcaseIcon />
          Experience
        </h2>
        <div class="home-exp-list">
          {experience.map((item) => (
            <div class="home-exp-item">
              <div class="home-exp-row">
                <span class="home-org-logo-badge">
                  <img class="home-org-logo" src={item.logo} alt={item.company} />
                </span>
                <div class="home-exp-text">
                  <span class="home-exp-role">{item.role}</span>
                  <span class="home-exp-company">{item.company}</span>
                  <div class="home-exp-meta">
                    <MetaRow period={item.period} location={item.location} />
                  </div>
                  {item.description && (
                    <div class="home-exp-body">
                      <p class="home-exp-desc">{item.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <GraduationCapIcon />
          Education
        </h2>
        <div class="home-edu-list">
          {education.map((item) => (
            <div class="home-edu-item">
              <span class="home-org-logo-badge">
                <img class="home-org-logo" src={item.logo} alt={item.institution} />
              </span>
              <div class="home-edu-text">
                <span class="home-edu-institution">{item.institution}</span>
                <span class="home-edu-degree">{item.degree}</span>
                <div class="home-edu-meta">
                  <MetaRow period={item.period} location={item.location} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <AwardIcon />
          Awards
        </h2>
        <div class="home-award-list">
          {awards.map((item) => (
            <div class="home-award-item">
              <div class="home-award-row">
                <span class="home-org-logo-badge">
                  <img class="home-org-logo" src={item.logo} alt={item.title} />
                </span>
                <div class="home-award-text">
                  <span class="home-award-title">{item.title}</span>
                  <p class="home-award-desc">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <GlobeIcon />
          Languages
        </h2>
        <div class="home-lang-list">
          {languages.map((lang) => (
            <div class="home-lang-item">
              <span class="home-lang-name">
                <span class="home-lang-flag">{lang.flag}</span>
                {lang.name}
              </span>
              <span class="home-lang-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

HomeProfile.css = style
export default (() => HomeProfile) satisfies QuartzComponentConstructor
