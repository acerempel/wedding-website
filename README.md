This is the source code for my wedding website. It's a static website with interactive elements,
generated using the [Solid Start](https://start.solidjs.com/) framework (which itself uses [SolidJS](https://www.solidjs.com/) and [Vite](https://vite.dev/)). It is hosted on [Netlify](https://www.netlify.com/); the original domain is no longer active, but the website is available at <https://xenodochial-haibt-ed0fdb.netlify.app/>. The CSS is based on [TailwindCSS](https://tailwindcss.com/).

Points of interest:
- An RSVP form that matches the name you type in against the pre-configured list of attendees (whose names have been redacted), dynamiclly creates enough entries for the number of guests in the party, and sends the form response to Netlify.
- A table-of-contents sidebar that highlights the link to the section that the user is currently viewing.