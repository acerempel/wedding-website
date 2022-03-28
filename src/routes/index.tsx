import RSVPForm from '../form'
import ServerForm from '~/server-form'
import Nav from '../nav'
import { Section } from "~/sections";
import {GoogleMap} from "~/map";

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
          <p>The wedding ceremony will take place at<strong> Church of the Ascension</strong> at 253 Echo Drive at 10:30 am.</p>
          <GoogleMap place_id="ChIJ_R9jrbwFzkwRYSDNlNd8XgE" name="Church of the Ascension" />
        </Section>
        <Section heading="Reception">
          <p>
            The reception will take place at the Old Town Hall community centre, located at 61 Main St.
            Come at 5:30pm for drinks and conversation; dinner will be served at 6:00pm.
          </p>
          <GoogleMap name="Old Town Hall" place_id="ChIJ-WJodKMFzkwRmAC3pmwc-Jc" />
        </Section>
        <Section heading="Registry">
          <p>Looking for gift ideas? <a href="https://www.myregistry.com/wedding-registry/jocelyn-veevers-and-alan-rempel-ottawa-on/2989103/giftlist">Visit our wedding registry!</a></p>
        </Section>
        <Section heading="RSVP">
          <p>
            We ask that you RSVP by June 1st. If you like, you may do so using this handy electronic form!
            RSVPs via email or post or other means are also acceptable;
            in that case, be sure to mention any dietary restrictions that apply to anyone in your party.
          </p>
          <ServerForm />
          <RSVPForm />
        </Section>
      </div>
    </main>
  );
}
