import ServerForm from '~/server-form'
import Nav from '../nav'
import { Section, Sections } from "~/sections";
import {GoogleMap} from "~/map";
import RSVPForm from '~/form';

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
        <p>Masks are required inside the church. N95-type masks are best; surgical masks are also good.</p>
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
          most guests who come by automobile can therefore leave their vehicles parked by the church and walk to the reception.
          Again, the map below may be helpful.
        </p>
        <GoogleMap name="Old Town Hall" place_id="ChIJ-WJodKMFzkwRmAC3pmwc-Jc" />
        <p>Guests may wear masks inside the Old Town Hall, but we anticipate that, because everyone will take off their masks to eat and drink,
        the benefits of mask-wearing will be minimal in this case.</p>
      </>
    }
})

Section({
  heading: "Getting there",
  get children() {
    return <>
      <h3>Parking</h3>
      <p>The parking lot of Immaculata High School, immediately to the south of the church along Echo Drive, is available all day for
      wedding guests. This parking lot is also accessible from Main St. There is very little parking by the Old Town Hall, but it is very close to the church on foot, so one can simply leave
      one's car by the church.</p>
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
        <RSVPForm />
      </>
    },
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
