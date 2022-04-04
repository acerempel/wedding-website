import {createMemo, For, JSX, onMount, Show} from "solid-js"
import {createStore} from "solid-js/store"
import addressees from "./addresses.json"

const enum Tag {
  Initial,
  MultipleMatches,
  GotInvitation,
  Submitted,
}

interface InitialState {
  tag: Tag.Initial
  input: string
  errorMessage?: string
}

interface MultipleMatchesState {
  tag: Tag.MultipleMatches
  input: string
  matchingInvitations: Invitation[]
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

type State = InitialState | MultipleMatchesState | GotInvitationState | SubmittedState

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
    if (state.tag !== Tag.Initial && state.tag !== Tag.MultipleMatches) {
      throw new Error(`internal error!! ${state.tag} Please alert alan.rempel@gmail.com!`)
    }
    const words = new Set(splitIntoWords(state.input) || null)
    if (words.size > 0) {
      const matching = invitations.filter((invite) => isSubsetOf(words, invite.names))
      if (matching.length == 1) {
        setState({ tag: Tag.GotInvitation, invitation: matching[0], errorMessage: undefined })
      } else if (matching.length == 0) {
        setState({ errorMessage: "No invitation found!" })
      } else {
        setState({ tag: Tag.MultipleMatches, matchingInvitations: matching, errorMessage: undefined })
      }
    } else {
      setState({ errorMessage: "You must type some words in the input field!" })
    }
  }

  function inviteDisplay(invite: Invitation): string {
    if (invite.guests.length <= 1) {
      return invite.addressee
    } else {
      return invite.addressee.concat(" (", ...invite.guests.join(", "), ")")
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
        setState({ tag: Tag.Submitted, errorMessage: undefined })
      } else {
        setState({ errorMessage: `There was a problem with submitting the form: ${response.statusText} (${response.status})` })
      }
    })
      .catch(() => setState({ errorMessage: "Submission failed! Try again." }))
  }

  return createMemo(() => {
    if (state.tag === Tag.Initial || state.tag === Tag.MultipleMatches) {
      return <form onsubmit={findInvitation}>
        <div class="flex flex-row">
          <Labeled
            label="Enter the names of your guests or the names to which your invitation was addressed."
            class="w-min grow mr-4"
          >
            <input type="text" value={state.input} oninput={(event) => setState({ input: event.currentTarget.value, errorMessage: undefined })}/>
          </Labeled>
          <button type="submit" class="w-max self-end button">Find invitation</button>
        </div>
        <Show when={state.errorMessage != null}>
          <ScrollIntoView alignBlock="end">
            <p class="mt-6">{state.errorMessage}</p>
          </ScrollIntoView>
        </Show>
        <Show when={state.tag === Tag.MultipleMatches}>
          <p>
            There are multiple invitations that match what you typed. Which one is yours?
          </p>
          <ul class="w-max">
            {(state as MultipleMatchesState).matchingInvitations.map((invite) => (
              <li class="bg-teal-50 hover:bg-teal-100 first:rounded-t-lg last:rounded-b-lg border-t border-l border-r last:border-b border-teal">
                <button
                  type="button"
                  class="text-left w-full py-3 px-4 interactive"
                  onclick={() => setState({tag: Tag.GotInvitation, invitation: invite, errorMessage: undefined})}
                >{inviteDisplay(invite)}</button>
              </li>
            ))}
          </ul>
        </Show>
      </form>
    } else if (state.tag === Tag.GotInvitation) {
      return <ScrollIntoView alignBlock="start">
        <form name="rsvp" method="post" action="/" class="space-y-6" onsubmit={submit}>
          <input type="hidden" name="form-name" value="rsvp" />
          <Labeled label="Addressee">
            <div class="relative mr-4">
              <input
                type="text" readonly={true} name="addressee" value={state.invitation.addressee}
                style="padding-right: calc(0.75rem * 2 + 5ch)"
                class="w-full"
              />
              <button
                type="button"
                class="interactive absolute inset-y-1 right-1 px-2 py-1 rounded hover:bg-teal-100"
                onclick={() => setState({tag: Tag.Initial, errorMessage: undefined, input: ""})}
              >Clear</button>
            </div>
          </Labeled>
          {
            state.invitation.guests.length === 1
            ? <Single guest={state.invitation.guests[0]} />
            : <Multiple guests={state.invitation.guests} />
          }
          <Labeled class="mr-4" label="Message (optional)">
            <textarea name="message"></textarea>
          </Labeled>
          <Show when={state.errorMessage}>
            <p>{state.errorMessage}</p>
          </Show>
          <button type="submit" class="button">Submit</button>
        </form>
      </ScrollIntoView>
    } else if (state.tag === Tag.Submitted) {
      return <p>Thank you for RSVPing!</p>
    }
  })
}

function ScrollIntoView(props: { alignBlock: "start" | "end" | "nearest", children: JSX.Element | JSX.Element[] }) {
  let elem: HTMLDivElement = undefined as unknown as HTMLDivElement;
  onMount(() => elem.scrollIntoView({ block: props.alignBlock, inline: "nearest" }))
  return (
    <div ref={elem}>{props.children}</div>
  )
}

function Labeled(props: { children: JSX.Element, label: string, class?: string }) {
  return <label class={`flex flex-col space-y-2 ${props.class ?? ""}`}>
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
  return <div class="flex flex-row flex-wrap">
    <input hidden type="hidden" name={`guest-${props.index}-name`} value={props.name}></input>
    <fieldset class="my-2 mr-4 flex flex-row flex-wrap">
      <legend class="label mb-2">Do you plan on attending?</legend>
      <div class="space-x-3">
        <label><input type="radio" required={true} name={`guest-${props.index}-attending`} value="yes"/> Yes</label>
        <label><input type="radio" required={true} name={`guest-${props.index}-attending`} value="no"/> No</label>
      </div>
    </fieldset>
    <Labeled class="my-2 mr-4 grow w-[300px]" label="Do you have any dietary restrictions?">
      <input type="text" name={`guest-${props.index}-dietary-restrictions`} />
    </Labeled>
  </div>
}
