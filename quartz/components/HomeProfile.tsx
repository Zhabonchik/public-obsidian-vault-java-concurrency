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
    class="section-icon"
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
}

interface Language {
  flag: string
  name: string
  level: string
}

const experience: ExperienceItem[] = [
  {
    role: "Product Development Engineer",
    company: "MIXI, Inc",
    companyUrl: "https://mixi.co.jp",
    logo: "/static/logos/mixi.svg",
    period: "Jan 2026 – Present",
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
      "Collaborated with Google Japan to bridge AI and university students — exploring practical Gemini use cases and promoting responsible AI integration on campus.",
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
  },
  {
    degree: "Computer Software Engineering",
    institution: "42 Network (Paris / São Paulo / Tokyo)",
    institutionUrl: "https://42.fr",
    logo: "/static/logos/42.svg",
    period: "2022 – 2025",
  },
]

const languages: Language[] = [
  { flag: "🇧🇷", name: "Portuguese", level: "Native" },
  { flag: "🇺🇸", name: "English", level: "Bilingual · TOEIC 945" },
  { flag: "🇯🇵", name: "Japanese", level: "Native · JLPT N1" },
  { flag: "🇪🇸", name: "Spanish", level: "Professional" },
  { flag: "🇨🇳", name: "Mandarin", level: "Working · HSK 3 · TBCL 4" },
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
                    <span class="home-exp-period">{item.period}</span>
                    <span class="home-exp-location">{item.location}</span>
                  </div>
                </div>
              </div>
              {item.description && (
                <div class="home-exp-body">
                  <p class="home-exp-desc">{item.description}</p>
                </div>
              )}
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
                <span class="home-edu-period">{item.period}</span>
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
