---
id: home
blueprint: pages
title: 'The wedding of Jocelyn Veevers and Alan Rempel'
template: home
sections:
  -
    title: Welcome!
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'We joyfully anticipate celebrating our marriage together with our families and friends.'
    slug: welcome
    type: prose
    enabled: true
    hide_heading: true
  -
    title: Ceremony
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'The wedding ceremony will take place at'
          -
            type: text
            marks:
              -
                type: bold
            text: ' Church of the Ascension'
          -
            type: text
            text: ' on Echo Drive at 10:00 am.'
      -
        type: set
        attrs:
          values:
            type: map
            name: 'Church of the Ascension'
            location: Church+of+the+Ascension
    type: prose
    enabled: true
    slug: ceremony
    hide_heading: false
  -
    title: Reception
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'The reception will take place at the Old Town Hall community centre.'
    slug: picnic
    type: prose
    enabled: true
    hide_heading: false
  -
    title: Gifts
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'Looking for gift ideas? Visit our wedding registry!'
    slug: gifts
    type: prose
    enabled: true
    hide_heading: false
  -
    title: 'COVID stuff'
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'All those attending the ceremony will be required to wear masks and to have received at least two doses of vaccines against COVID-19.'
    slug: covid
    type: prose
    enabled: true
    hide_heading: false
  -
    title: Parking
    content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'There are some parking lots'
    slug: parking
    type: prose
    enabled: true
    hide_heading: false
  -
    type: rsvp_form
    title: RSVP
    enabled: true
    rsvp_options:
      -
        default: false
        label: 'Regrettably not'
      -
        default: true
        label: 'Happily yes!'
      -
        default: false
        label: Maybe
    slug: rsvp
updated_by: e48f6027-09ad-467d-861a-02b67df6db3e
updated_at: 1644873262
subtitle: 'Saturday, September 3rd, 2022'
---
Welcome to your new Statamic website.
