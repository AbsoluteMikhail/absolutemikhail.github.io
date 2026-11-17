import { openPrivacySettings } from "@/lib/privacyPreferences";

export const legalContentEn = {
  privacy: {
    title: "Privacy Policy",
    content: () => (
      <>
        <p>I am Mikhail Efremov (Absolute Mikhail), the author of gamepunk.ru. This website presents GamePunk, its team, games and other projects. It also hosts my personal portfolio, project archive, Academy and mentoring information. This policy applies to the Russian and English versions of the website. The Malena bot has a <a className="text-primary underline underline-offset-4 hover:text-accent" href="/malena/privacy/">separate policy (in Russian)</a>.</p>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Information used</h2>
          <p>The website has no registration, user accounts or message submission forms. I do not maintain a separate visitor database. If you contact me by email or messenger, I receive the information you provide: your name or nickname, contact details, message and attachments. I use it to reply and discuss your request.</p>
          <p className="mt-3">When you open the website, its host, GitHub Pages, receives technical information needed to deliver pages and keep the service secure, including your IP address. Its handling of this information is described in the <a className="text-primary underline underline-offset-4 hover:text-accent" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Analytics are your choice</h2>
          <p>Google Analytics and Yandex Metrica load after you select “Allow analytics”, including on later visits while your saved choice remains valid. Before consent, or if you choose “Without analytics”, the website does not load these trackers or send events to them. Continuing to browse does not enable analytics. Analytics are disabled on the privacy policy and terms pages.</p>
          <p className="mt-3">Statistics help me understand visits and improve the website. These services may process page addresses, referral sources, browser and device information, approximate location and cookie identifiers. The service also receives your IP address when your browser connects to it; further processing depends on the service.</p>
          <p className="mt-3">After consent, the studio homepage also sends events for opening projects and contact options, choosing a contact method, starting and finishing a full video, and reaching 25%, 50% and 75% of its duration. These milestones reflect the player position, including seeking; choosing a contact method does not mean that a message was sent. Event parameters include the project, site language, page path without query parameters or fragments, button placement, contact method and video milestone. Names, contact addresses and message text are not included in these events. Short hover previews do not count as full-video views, and actions taken before consent are not sent retrospectively.</p>
          <p className="mt-3">Yandex Metrica’s session replay, click maps, automatic link tracking and accurate bounce tracking are disabled. Google advertising signals and ad personalization are also disabled. The website does not send your correspondence to analytics services.</p>
          <p className="mt-3">Analytics providers are Google and YANDEX LLC. See the <a className="text-primary underline underline-offset-4 hover:text-accent" href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> and the <a className="text-primary underline underline-offset-4 hover:text-accent" href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">Yandex Privacy Policy</a> for details. I have access to reports from these services.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. Your choice and how to change it</h2>
          <p>Your acceptance or refusal, the date of your choice and the settings version are stored in your browser’s local storage for 180 days. This avoids asking you on every page and is not sent to a separate website database. If your browser blocks storage, your choice lasts until the page reloads.</p>
          <p className="mt-3">Your choice of light or dark theme in sections with a theme switch is saved in this browser for 180 days. Theme preferences and reading progress work independently of analytics consent and are not included in the website’s analytics events. To recover from a loading error, the website also stores a technical flag for the current tab to prevent repeated automatic reloads.</p>
          <p className="mt-3">The Academy stores the material’s address, reading percentage, section to resume and save date in this browser’s local storage. Progress remains valid for 180 days after the last advance through the material. It is not synced between devices or sent by the website to a server or analytics service. You can remove it by clearing gamepunk.ru data in your browser settings. Materials and navigation still work if storage is unavailable.</p>
          <p className="mt-3">The personal portfolio includes a pixel-bug mini-game. When analytics are allowed, its score is saved in local storage and a website cookie for up to 365 days after a score update. The score itself is not sent in Google Analytics or Metrica events; the cookie may accompany requests to gamepunk.ru. If you decline analytics, the saved score is neither read nor updated. To delete it and other local settings, clear the website’s data in your browser.</p>
          <p className="mt-3">You can <button type="button" className="text-primary underline underline-offset-4 hover:text-accent" onClick={openPrivacySettings}>change your analytics settings</button> at any time. Declining stops further collection, removes analytics cookies accessible to the website and reloads the page if the trackers were running. It does not automatically delete data already received by Google or Yandex. Cookies belonging to other domains can be removed in your browser settings.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. Correspondence and retention</h2>
          <p>Messages may remain in the email or messaging service you used until they are deleted. The website has no separate store of enquiries. To ask about, correct or delete correspondence accessible to me, use the contact button below. If any information must be retained by law, I will explain this when handling your request.</p>
          <p className="mt-3">Hosting logs and analytics data are stored by the respective services. Their retention and deletion depend on the service’s policies and retention settings; they are not a database maintained by this website. You can ask me or the service provider about specific data.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Embedded content and other platforms</h2>
          <p>Some pages contain videos and other embedded content from YouTube, Rutube and BlueprintUE. Loading embedded content connects your browser to that platform, which receives technical request information and may use its own cookies. On the studio homepage, the full Rutube player loads when you open a game dialog and attempts to play automatically. The website’s analytics settings control only Google Analytics and Yandex Metrica: declining does not block embedded players, their cookies or any platform advertising.</p>
          <p className="mt-3">When you follow a link to a store, social network, email or messaging service, that platform’s rules apply. Services used here, including GitHub and Google, may process information outside Russia. Their policies describe the processing conditions and locations.</p>
          <p className="mt-3">I do not sell your personal data. Communication uses the email or messaging service you choose; information may also be accessed where required or permitted by law.</p>
        </section>
      </>
    ),
  },
  terms: {
    title: "Terms of Use",
    content: () => (
      <>
        <p>These terms apply to gamepunk.ru: the pages of GamePunk, its games and other projects, Mikhail Efremov’s (Absolute Mikhail) personal portfolio and the Academy’s learning materials. They cover both the Russian and English versions of the website.</p>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Rights to materials</h2>
          <p>The website presents my original materials, team projects and third-party materials. Rights to text, images, video, code, games and trademarks belong to their respective rights holders. Describing my involvement in a project does not imply that I own all rights to it.</p>
        </section>
        <section id="educational-code" className="scroll-mt-6">
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Educational code — free to use</h2>
          <p>My original educational code examples and Blueprint graphs published in the Academy are available under the <a className="text-primary underline underline-offset-4 hover:text-accent" href="/academy-code-license.txt">0BSD license</a>. You may use, copy, modify and distribute them free of charge for any purpose, including commercial and closed-source projects, without separate permission or mandatory attribution.</p>
          <p className="mt-3">If you would like to credit me or link to the material, I would appreciate it. This is optional thanks, not a condition of use.</p>
          <p className="mt-3">This permission covers my educational examples. Third-party code, libraries and components remain subject to their rights holders’ licenses. It does not automatically cover entire games, course text, videos, music, images or other materials.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. Other materials</h2>
          <p>You may share links to the website’s pages. Copying, adapting and distributing other materials is allowed under the applicable license, with the relevant rights holder’s permission, or where permitted by law, including lawful quotation with attribution and a source reference.</p>
          <p className="mt-3">The website’s original source code, styles and build scripts have a separate license in the repository’s LICENSE file. It permits use, including commercial use, subject to retaining the copyright notice and license text, identifying modifications and crediting Absolute Mikhail as specified in that license. It does not cover games, photographs, illustrations, video, music, text or logos. Academy educational examples retain their separate 0BSD license without mandatory attribution.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. Educational examples and website operation</h2>
          <p>Materials and examples are provided “as is”: they may contain errors, become outdated or require adaptation to your project. Check code before using it. I do not promise uninterrupted website operation or a particular learning outcome. These terms do not limit rights that the law grants you on a mandatory basis.</p>
          <p className="mt-3">We agree the terms of a particular consultation or engagement separately. Game purchases and third-party services are subject to the relevant platform’s and rights holder’s terms.</p>
          <p className="mt-3">These terms do not replace analytics consent. You can allow or disable analytics in the settings; the <a className="text-primary underline underline-offset-4 hover:text-accent" href="/en/privacy/">privacy policy</a> describes events, local storage and embedded services.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Updates to these terms</h2>
          <p>The current version is published on this page with its revision date. Later changes do not revoke the 0BSD permission already granted for educational examples published under that license.</p>
        </section>
      </>
    ),
  },
};
