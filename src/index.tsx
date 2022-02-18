/* @refresh reload */
import { render } from 'solid-js/web'
import './tailwind.css'
import './site'
import RSVPForm from './form'
const element = document.getElementById('rsvp-form')
if (! element) { throw new Error("no form element!!!") }
render(RSVPForm, element)