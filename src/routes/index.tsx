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
          <p>
            Welcome! We joyfully anticipate celebrating our marriage together with our families and friends.
          </p>
        </Section>
        <Section heading="Ceremony">
          <p>
            The wedding ceremony will take place at the <strong>Church of the Ascension</strong> at 10:30 am.
            The church is located at 253 Echo Drive, Ottawa, Ontario.
            See the map below, courtesy of Google, for more details and directions.
          </p>
          <GoogleMap place_id="ChIJ_R9jrbwFzkwRYSDNlNd8XgE" name="Church of the Ascension" />
        </Section>
        <Section heading="Reception">
          <p>
            The reception will take place at the <strong>Old Town Hall Community Centre</strong>, located at 61 Main St.
            Come at 5:00pm for drinks, bites, and conversation 
            <em>(note that this start time is half an hour earlier than what is on your invitations, which say 5:30pm)</em>.
            Dinner will be served at 6:00pm.
          </p>
          <p>
            The Old Town Hall is situated very close to the church, about five minutes away on foot;
            most guests who come by automobile will therefore need only one parking spot for both venues.
            Again, the map below may be helpful.
          </p>
          <GoogleMap name="Old Town Hall" place_id="ChIJ-WJodKMFzkwRmAC3pmwc-Jc" />
        </Section>
        <Section heading="Getting there">
          <h3>By automobile</h3>
          <p>Check back here at a later date for information on parking and other relevant details for motorists.</p>
          <h3>By public transit</h3>
          <p>
            Nearby bus routes include the 5 and 55, which both come every half-hour and run along Main st, and the 14,
            which comes every 15 minutes and runs along Elgin St (just on the other side of the canal from the festivities).
          </p>
          <p>
            The Lees O-Train station is perhaps a 15-minute walk away; trains come every 5 minutes.
          </p>
          <h3>By bicycle</h3>
          <p>
            The nearby north-south thoroughfare of Main St has segregated bike lanes that will be useful for anyone coming
            from points south of the festivities. There are also multi-use pathways along both sides of the Rideau canal.
          </p>
          <p>
            Travellers from the east side of the Rideau River may cross at either the O-Train bridge
            or the old train bridge and then make their way westward along Lees (which has painted bike lanes) towards the church.
          </p>
          <p>
            For cyclists setting out from the Glebe or points west, the Flora Footbridge is the ideal place to cross the canal;
            from there, one may simply head north on Echo Drive until one sees streamers.
          </p>
        </Section>
        <Section heading="Gifts">
          <p>
            Looking for gift ideas? 
            <a href="https://www.myregistry.com/wedding-registry/jocelyn-veevers-and-alan-rempel-ottawa-on/2989103/giftlist">Visit our wedding registry!</a>
          </p>
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
