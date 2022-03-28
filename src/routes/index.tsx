import RSVPForm from '../form'
import ServerForm from '~/server-form'
import Nav from '../nav'
import { Section } from "~/sections";

export default function Home() {
  const mainClasses = `
    justify-center max-w-3xl mx-auto sm:max-w-none
    grid grid-single-column sm:grid-main-and-one-side md:grid-main-and-sides
    gap-4 sm:gap-y-6 sm:gap-x-12`
  return (
    <main class={mainClasses}>
      <header class="grid-header">
        <h1 class="text-3xl font-light">The wedding of Jocelyn Veevers and Alan Rempel</h1>
        <p class="italic my-3">Saturday, September 3rd, 2022</p>
      </header>
      <Nav />
      <div class="space-y-8 divide-y divide-maroon-200 grid-main">
        <Section heading="Welcome!" invisibleHeading>
        <p>We joyfully anticipate celebrating our marriage together with our families and friends.</p>
        </Section>
        <Section heading="Ceremony">
          <p>The wedding ceremony will take place at<strong> Church of the Ascension</strong> on Echo Drive at 10:00 am.</p>

          <details>
            <summary>Show map to Church of the Ascension</summary>
            <div class="flex justify-center">
              <iframe
              width="358" height="250"
              frameborder="0" class="border-0"
              loading="lazy"
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ_R9jrbwFzkwRYSDNlNd8XgE&key=AIzaSyD0nXcUaXvggMnKByvgGL6O5QnhzLiOV2s"
              ></iframe>
            </div>
          </details>
        </Section>
        <Section heading="Reception">
          <p>The reception will take place at the Old Town Hall community centre.</p>
        </Section>
        <Section heading="Registry">
          <p>Looking for gift ideas? Visit our wedding registry!</p>
        </Section>
        <Section heading="RSVP">
          <ServerForm />
          <RSVPForm />
        </Section>
      </div>
    </main>
  );
}
