import {createMemo, For, JSX, Show} from "solid-js"
import {createStore} from "solid-js/store"
import addressees from "./addresses.json"

const enum Tag {
  Initial,
  GotInvitation,
  Submitted,
}

interface InitialState {
  tag: Tag.Initial
  input: string
  errorMessage?: string
}

interface GotInvitationState {
  tag: Tag.GotInvitation
  invitation: Invitation
  errorMessage?: string
}

interface SubmittedState {
  tag: Tag.Submitted
}

type State = InitialState | GotInvitationState | SubmittedState

interface Invitation {
  addressee: string
  names: Set<string>
  guests: string[]
}

function splitIntoWords(str: string) {
  const namePattern = /\w+/g
  return str.match(namePattern)?.filter((m) => m !== "and")
}

function isSubsetOf<T>(set1: Set<T>, set2: Set<T>) {
  for (const item of set1) {
    if (! set2.has(item)) {
      return false
    }
  }
  return true
}

function createInvitations(): Invitation[] {
  const invitations: Invitation[] = []
  for (const [guests_str, addressee] of Object.entries(addressees)) {
    const guests = splitIntoWords(guests_str) || []
      const names = new Set([...guests])
      const addresseeNames = splitIntoWords(addressee)
      if (addresseeNames) {
        for (const name of addresseeNames) { names.add(name) }
      }
    const invite = { addressee, names, guests }
    invitations.push(invite)
  }
  return invitations
}

export default function Form() {
  const invitations = createInvitations()
  const [state, setState] = createStore({ tag: Tag.Initial, input: "" } as State)

  function findInvitation(event: SubmitEvent) {
    event.preventDefault()
    if (state.tag !== Tag.Initial) {
      throw new Error(`internal error!! ${state.tag} Please alert alan.rempel@gmail.com!`)
    }
    const words = new Set(splitIntoWords(state.input) || null)
    if (words.size > 0) {
      const invitation = invitations.find((invite) => isSubsetOf(words, invite.names))
      if (invitation) {
        setState({ tag: Tag.GotInvitation, invitation })
      } else {
        setState({ errorMessage: "No invitation found!!!" })
      }
    } else {
      setState({ errorMessage: "You must type some words in the input field!" })
    }
  }

  const submit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // TypeScript thinks you can't pass FormData to the URLSearchParams constructor!
      body: new URLSearchParams(data as any).toString(),
    }).then((response) => {
      if (response.ok) {
        setState({ tag: Tag.Submitted })
      } else {
        setState({ errorMessage: `There was a problem with submitting the form: ${response.statusText} (${response.status})` })
      }
    })
      .catch(() => setState({ errorMessage: "Submission failed! Try again." }))
  }

  return createMemo(() => {
    if (state.tag === Tag.Initial) {
      return <form onsubmit={findInvitation}>
        <input type="text" oninput={(event) => setState({ input: event.currentTarget.value })}/>
        <button type="submit">Find invitation</button>
        <Show when={state.errorMessage != null}>
          <p>{state.errorMessage}</p>
        </Show>
      </form>
    } else if (state.tag === Tag.GotInvitation) {
      return <form name="rsvp" method="post" action="/" onsubmit={submit}>
        <input type="hidden" name="form-name" value="rsvp" />
        <label>
          <span>Addressee</span>
          <input type="text" readonly={true} name="addressee" value={state.invitation.addressee} />
        </label>
        {
          state.invitation.guests.length === 1
          ? <Single guest={state.invitation.guests[0]} />
          : <Multiple guests={state.invitation.guests} />
        }
        <Show when={state.errorMessage}>
          <p>{state.errorMessage}</p>
        </Show>
        <button type="submit">Submit</button>
      </form>
    } else if (state.tag === Tag.Submitted) {
      return <p>Thank you for RSVPing!</p>
    }
  })
}

function Single(_: { guest: string }) {
  return <Fields index={0} />
}

function Multiple(props: {guests: readonly string[]}) {
  return <For each={props.guests}>
    {(guest, index) => <fieldset>
      <legend>{guest}</legend>
      <Fields index={index()} />
    </fieldset>}
  </For>
}

function Fields(props: { index: number }) {
  return <>
    <fieldset>
      <legend>Do you plan on attending?</legend>
      <label><input type="radio" required={true} name={"guest-" + props.index + "-attending"} value="yes"/> Yes</label>
      <label><input type="radio" required={true} name={"guest-" + props.index + "-attending"} value="no"/> No</label>
    </fieldset>
    <label>
      <span>Do you have any dietary restrictions?</span>
      <input type="text" name={"guest-" + props.index + "dietary-restrictions"} />
    </label>
  </>
}
