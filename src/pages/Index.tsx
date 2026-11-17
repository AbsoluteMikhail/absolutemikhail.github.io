import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ContactMessenger } from "@/components/ContactMessenger";
import { Button, buttonStyles } from "@/components/ui/button";
import StudioGameCard from "@/components/StudioGameCard";
import { SectionTitle } from "@/components/ui/section-title";
import { projects } from "@/constants/projects";
import { workshop } from "@/constants/workshop";
import { gamepunkLinks } from "@/constants/contactLinks";
import { openPrivacySettings } from "@/lib/privacyPreferences";
import { trackAnalytics } from "@/lib/analytics";
import { legalHref } from "@/lib/siteContext";
import { studioCopy } from "@/constants/studioCopy";
import { studioLocale } from "@/lib/studioLocale";
import heroCollage from "@/assets/studio/hero-collage.webp";
import studioLogo from "@/assets/studio/gamepunk-logo.svg";
import unrealSticker from "@/assets/studio/unreal-five-sticker.webp";
import paintArrow from "@/assets/studio/paint-arrow.webp";
import heroPhoto from "@/assets/hero-photo.webp";
import bartsevPhoto from "@/assets/studio/alexey-bartsev.webp";

const studioGames = ["duelant", "gribnik"].map((slug) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing studio project: ${slug}`);
  return project;
});

const Index = () => {
  const { pathname, hash, search } = useLocation();
  const locale = studioLocale(pathname);
  const copy = studioCopy[locale];
  const home = locale === "en" ? "/en/" : "/";
  const languageLinks = (
    <div className="studio-languages" role="group" aria-label={copy.language}>
      <Link to={{ pathname: "/", search, hash }} lang="ru" hrefLang="ru" aria-label="Русский" aria-current={locale === "ru" ? "page" : undefined}>RU</Link>
      <span aria-hidden="true">/</span>
      <Link to={{ pathname: "/en/", search, hash }} lang="en" hrefLang="en" aria-label="English" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
    </div>
  );
  return (
    <div className={`studio-page studio-page-${locale}`} lang={locale}>
      <a href="#main-content" className="skip-link">{copy.skip}</a>
      <header className="studio-header studio-container">
        <Link to={home} aria-label={copy.home}><img className="studio-logo" src={studioLogo} width="1756" height="551" alt="GamePunk" /></Link>
        <nav aria-label={copy.navigation} className="studio-nav">
          <a href="#projects">{copy.projects}</a>
          <a href="#studio">{copy.studio}</a>
          <ContactMessenger studio locale={locale} analyticsPlacement="header" variant="unstyled" size="none" effect="none" className="studio-nav-contact">{copy.contact} <ArrowUpRight aria-hidden="true" /></ContactMessenger>
        </nav>
        {languageLinks}
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="studio-hero studio-container" aria-labelledby="studio-title">
          <div className="studio-hero-copy">
            <h1 id="studio-title"><span className="studio-title-line"><span className="studio-title-highlight">{copy.hero[0]}</span>.</span><span className="studio-title-line">{copy.hero[1]}</span><span className="studio-title-line">{copy.hero[2]}</span></h1>
            <p className="studio-hero-description">{copy.description}<br className="studio-desktop-break" /> {copy.descriptionEnd}</p>
            <a href="#projects" className={buttonStyles({ variant: "unstyled", size: "none", effect: "none", className: "studio-button" })}>{copy.viewProjects} <ArrowDown aria-hidden="true" /></a>
          </div>
          <p className="studio-eyebrow">{copy.independent[0]}<br />{copy.independent[1]}</p>
          <div className="studio-collage">
            <img className="studio-collage-art" src={heroCollage} width="1088" height="1440" alt={copy.collageAlt} {...{ fetchpriority: "high" }} />
            <img className="studio-collage-sticker" src={unrealSticker} width="384" height="351" alt={copy.stickerAlt} />
          </div>
        </section>

        <section id="projects" className="studio-projects studio-container" aria-labelledby="studio-projects-title">
          <p className="studio-kicker">{copy.projectsKicker}</p>
          <SectionTitle id="studio-projects-title" className="studio-heading">{copy.projectsTitle}</SectionTitle>
          <div className="studio-project-grid">
            {studioGames.map((project, index) => <StudioGameCard key={project.slug} project={project} index={index} locale={locale} />)}
            <a href={workshop.malena.url} target="_blank" rel="noopener noreferrer" className="studio-project studio-project-3" onClick={() => trackAnalytics("project_open", { project_id: "malena", placement: "project_card" })}>
              <div className="studio-project-image"><img src={workshop.malena.portrait} srcSet={workshop.malena.portraitSrcSet} sizes="(max-width: 600px) 100vw, 40vw" width="896" height="1200" loading="lazy" decoding="async" alt={copy.malenaAlt} /></div>
              <div className="studio-project-caption"><div><h3>{copy.malena}</h3><p>{copy.malenaType}</p></div><ArrowUpRight aria-hidden="true" /></div>
            </a>
          </div>
          <a className="studio-text-link studio-games-link" href={gamepunkLinks.steam} target="_blank" rel="noopener noreferrer">{copy.moreGames} <ArrowUpRight aria-hidden="true" /></a>
        </section>

        <section id="manifesto" className="studio-manifesto" aria-labelledby="studio-manifesto-title">
          <div className="studio-container studio-manifesto-layout">
            <div>
              <p className="studio-kicker">{copy.manifestoKicker}</p>
              <SectionTitle id="studio-manifesto-title" className="studio-heading">{copy.manifesto[0]}<br />{copy.manifesto[1]}</SectionTitle>
              <p className="studio-manifesto-copy">{copy.manifestoCopy}</p>
            </div>
            <img className="studio-manifesto-arrow" src={paintArrow} width="1280" height="1280" alt="" loading="lazy" aria-hidden="true" />
          </div>
        </section>

        <section id="studio" className="studio-people studio-container" aria-labelledby="studio-people-title">
          <p className="studio-kicker">{copy.peopleKicker}</p>
          <SectionTitle id="studio-people-title" className="studio-heading">{copy.peopleTitle}</SectionTitle>
          <div className="studio-people-layout">
            <article className="studio-person">
              <div className="studio-person-intro">
              <Link to="/mikhail/" className="studio-portrait" aria-label={copy.aboutPerson}>
                <img src={heroPhoto} width="292" height="363" loading="lazy" decoding="async" alt={copy.personFull} />
                <svg className="studio-portrait-outline" viewBox="0 0 292 363" fill="none" aria-hidden="true">
                  <path d="M144 25 155 26 163 30 171 31 180 38 184 44 191 49 195 62 195 89 201 90 205 96 204 109 199 122 192 130 187 149 186 166 188 174 198 180 M111 213 101 216 94 222 87 230 82 242 78 250 73 271 67 284 63 303 58 315 55 339 49 362" />
                </svg>
              </Link>
              <div className="studio-person-copy"><h3>{copy.person[0]}<br />{copy.person[1]}</h3><p className="studio-person-role">{copy.developer}<br /><span>{copy.credential}</span></p><p className="studio-person-specialization">{copy.specialization}</p><Link className="studio-text-link" to="/mikhail/">{copy.personalPage} <ArrowUpRight aria-hidden="true" /></Link></div>
              </div>
              <div className="studio-person-note"><p>{copy.note[0]}<br />{copy.note[1]}</p><p className="studio-person-achievement">{copy.personAchievement}</p><Link className="studio-text-link" to="/projects/">{copy.archive} <ArrowUpRight aria-hidden="true" /></Link></div>
            </article>
            <article className="studio-person">
              <div className="studio-person-intro">
                <div className="studio-portrait studio-portrait-bartsev">
                  <div className="studio-portrait-crop"><img src={bartsevPhoto} width="576" height="768" loading="lazy" decoding="async" alt={copy.secondPerson.fullName} /></div>
                  <svg className="studio-portrait-outline" viewBox="0 0 292 363" fill="none" aria-hidden="true">
                    <path d="M120 28 136 31 149 38 158 48 164 61 170 76 171 82 C174 80 177 82 179 86 C181 90 181 95 180 101 L178 110 Q177 117 172 118 L171 117 175 132 179 142 192 145 207 153 M96 166 88 173 72 181 61 184 52 191 42 194 34 206 23 219 13 236 3 261" />
                  </svg>
                </div>
                <div className="studio-person-copy"><h3>{copy.secondPerson.name[0]}<br />{copy.secondPerson.name[1]}</h3><p className="studio-person-role">{copy.secondPerson.role}<br /><span>{copy.secondPerson.credential}</span></p><p className="studio-person-specialization">{copy.secondPerson.specialization}</p></div>
              </div>
              <div className="studio-person-note"><p>{copy.secondPerson.experience}</p><p className="studio-person-achievement">{copy.secondPerson.achievement}</p></div>
            </article>
          </div>
        </section>

        <section id="contact" className="studio-contact" aria-labelledby="studio-contact-title">
          <div className="studio-container studio-contact-layout">
            <SectionTitle id="studio-contact-title" className="studio-heading">{copy.talk[0]}<br />{copy.talk[1]}</SectionTitle>
            <ContactMessenger studio locale={locale} analyticsPlacement="contact" variant="unstyled" size="none" effect="none" className="studio-button">{copy.write} <ArrowUpRight aria-hidden="true" /></ContactMessenger>
          </div>
        </section>
      </main>

      <footer className="studio-footer studio-container">
        <Link to={home} aria-label={copy.home}><img className="studio-logo" src={studioLogo} width="1756" height="551" alt="GamePunk" loading="lazy" /></Link>
        <nav aria-label={copy.footerNavigation}><Link to="/mikhail/">{copy.mikhail}</Link><Link to="/academy/">{copy.academy}</Link><Link to={legalHref("/privacy/", locale === "en" ? "en" : "studio")}>{copy.privacy}</Link><Link to={legalHref("/terms/", locale === "en" ? "en" : "studio")}>{copy.terms}</Link><Button variant="unstyled" size="none" onClick={openPrivacySettings}>{copy.analytics}</Button></nav>
        {languageLinks}
        <p>{copy.signoff}</p>
      </footer>
    </div>
  );
};

export default Index;
