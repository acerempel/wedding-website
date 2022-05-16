import ServerForm from '~/server-form'
import Nav from '../nav'
import { Section, Sections } from "~/sections";
import {GoogleMap} from "~/map";
import { createSignal, lazy, Show } from 'solid-js';

Section({
  heading: "Welcome",
  invisibleHeading: true,
  get children() {
    return <p>
      Welcome! We joyfully anticipate celebrating our marriage together with our families and friends.
    </p>
  }
})

Section({
    heading: "Ceremony",
    get children() {
      return <>
        <p>
          The wedding ceremony will take place at the Church of the Ascension at <strong>10:30 am</strong>.
          The church is located at 253 Echo Drive, Ottawa, Ontario.
          See the map below, courtesy of Google, for more details and directions.
        </p>
        <GoogleMap place_id="ChIJ_R9jrbwFzkwRYSDNlNd8XgE" name="Church of the Ascension" />
      </>
    }
})

Section({
    heading: "Reception",
    get children() {
      return <>
        <p>
          The reception will take place at the Old Town Hall Community Centre, located at 61 Main St.
          Come at <strong>4:30 pm</strong> for drinks, bites, and conversation. <em>(<strong>Note</strong> that this start time is one hour earlier
          than what is on your invitations, which say 5:30pm, and half an hour earlier than what was previous stated on this webpage)</em>.
          Dinner will be served at 6:00pm.
        </p>
        <p>
          The Old Town Hall is situated very close to the church, about five minutes away on foot;
          most guests who come by automobile will therefore need only one parking spot for both venues.
          Again, the map below may be helpful.
        </p>
        <GoogleMap name="Old Town Hall" place_id="ChIJ-WJodKMFzkwRmAC3pmwc-Jc" />
      </>
    }
})

Section({
    heading: "Gifts",
    get children() {
      return <>
        <p>
          Looking for gift ideas? <a href="https://www.myregistry.com/wedding-registry/jocelyn-veevers-and-alan-rempel-ottawa-on/2989103/giftlist">Visit our wedding registry!</a>
        </p>
      </>
    }
})

const RSVPForm = lazy(() => import("~/form"))

const [formVisible, setFormVisible] = createSignal(false)

Section({
    heading: "RSVP",
    get children() {
      return <>
        <p>
          We ask that you RSVP by June 1st. If you like, you may do so using this handy electronic form!
          RSVPs via email or post or other means are also acceptable;
          in that case, be sure to mention any dietary restrictions that apply to anyone in your party.
        </p>
        <ServerForm />
        <Show when={formVisible()}>
          <RSVPForm />
        </Show>
      </>
    },
    onVisible: () => setFormVisible(true),
})

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
        <Sections />
      </div>
    </main>
  );
}
