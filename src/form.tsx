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
        <div class="flex flex-row">
          <Labeled
            label="Enter the names of your guests or the names to which your invitation was addressed."
            class="w-min grow mr-4"
          >
            <input type="text" oninput={(event) => setState({ input: event.currentTarget.value })}/>
          </Labeled>
          <button type="submit" class="w-max self-end button">Find invitation</button>
        </div>
        <Show when={state.errorMessage != null}>
          <p>{state.errorMessage}</p>
        </Show>
      </form>
    } else if (state.tag === Tag.GotInvitation) {
      return <form name="rsvp" method="post" action="/" class="space-y-6" onsubmit={submit}>
        <input type="hidden" name="form-name" value="rsvp" />
        <Labeled label="Addressee">
          <input type="text" readonly={true} name="addressee" value={state.invitation.addressee} />
        </Labeled>
        {
          state.invitation.guests.length === 1
          ? <Single guest={state.invitation.guests[0]} />
          : <Multiple guests={state.invitation.guests} />
        }
        <Labeled label="Message (optional)">
          <textarea name="message"></textarea>
        </Labeled>
        <Show when={state.errorMessage}>
          <p>{state.errorMessage}</p>
        </Show>
        <button type="submit" class="button">Submit</button>
      </form>
    } else if (state.tag === Tag.Submitted) {
      return <p>Thank you for RSVPing!</p>
    }
  })
}

function Labeled(props: { children: JSX.Element, label: string, class?: string }) {
  return <label class={`flex flex-col space-y-1.5 ${props.class}`}>
    <span class="label">{props.label}</span>
    {props.children}
  </label>
}

function Single(props: { guest: string }) {
  return <Fields index={0} name={props.guest} />
}

function Multiple(props: {guests: readonly string[]}) {
  return <For each={props.guests}>
    {(guest, index) => <fieldset>
      <legend class="font-bold">{guest}</legend>
      <Fields index={index()} name={guest} />
    </fieldset>}
  </For>
}

function Fields(props: { index: number, name: string }) {
  return <div class="space-y-3">
    <input type="hidden" name={`guest-${props.index}-name`} value={props.name}></input>
    <fieldset>
      <legend class="label mb-1.5">Do you plan on attending?</legend>
      <div class="space-x-3">
        <label><input type="radio" required={true} name={`guest-${props.index}-attending`} value="yes"/> Yes</label>
        <label><input type="radio" required={true} name={`guest-${props.index}-attending`} value="no"/> No</label>
      </div>
    </fieldset>
    <Labeled label="Do you have any dietary restrictions?">
      <input type="text" name={`guest-${props.index}-dietary-restrictions`} />
    </Labeled>
  </div>
}
