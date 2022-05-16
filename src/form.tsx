import {batch, createSignal, For, JSX, Match, Show, Switch} from "solid-js"
import addressees from "./addresses.json"

const enum Tag {
  Initial,
  MultipleMatches,
  GotInvitation,
  Submitted,
}

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
  const [stateTag, setStateTag] = createSignal(Tag.Initial)
  const [errorMsg, setErrorMsg] = createSignal<string>()
  let invitation: Invitation
  let matchingInvitations: Invitation[]

  const findInvitation: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault()
    const currentTag = stateTag()
    if (currentTag !== Tag.Initial && currentTag !== Tag.MultipleMatches) {
      throw new Error(`internal error!! ${stateTag()} Please alert alan.rempel@gmail.com!`)
    }
    const input = (event.currentTarget.elements.namedItem('query') as HTMLInputElement).value
    const words = new Set(splitIntoWords(input) || null)
    if (words.size > 0) {
      const matching = invitations.filter((invite) => isSubsetOf(words, invite.names))
      if (matching.length == 1) {
        invitation = matching[0]
        batch(() => {
          setStateTag(Tag.GotInvitation)
          setErrorMsg(undefined)
        })
      } else if (matching.length == 0) {
        setErrorMsg("No invitation found!")
      } else {
        matchingInvitations = matching
        batch(() => {
          setStateTag(Tag.MultipleMatches)
          setErrorMsg(undefined)
        })
      }
    } else {
      setErrorMsg("You must type some words in the input field!")
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
        batch(() => {
          setStateTag(Tag.Submitted)
          setErrorMsg(undefined)
        })
      } else {
        setErrorMsg(`There was a problem with submitting the form: ${response.statusText} (${response.status})`)
      }
    })
      .catch(() => setErrorMsg("Submission failed! Try again."))
  }

  return <Switch>
    <Match when={stateTag() === Tag.Initial || stateTag() === Tag.MultipleMatches}>
      <form onsubmit={findInvitation}>
        <div class="flex flex-row">
          <Labeled
            label="Enter the names of your guests or the names to which your invitation was addressed."
            class="w-min grow mr-4"
          >
            <input type="search" name="query" />
          </Labeled>
          <button type="submit" class="w-max self-end button button-teal">Find invitation</button>
        </div>
        <Show when={errorMsg() != null}>
          <ScrollIntoView alignBlock="end">
            <p class="mt-6">{errorMsg()}</p>
          </ScrollIntoView>
        </Show>
        <Show when={stateTag() === Tag.MultipleMatches}>
          <p>
            There are multiple invitations that match what you typed. Which one is yours?
          </p>
          <ScrollIntoView alignBlock="end">
            <ul>
            {matchingInvitations!.map((invite) => (
              <li>
                <button
                  type="button"
                  class="inline-block text-left link underline-md font-medium py-2 px-3 hover:bg-teal-50 rounded"
                  onclick={() => { invitation = invite; setStateTag(Tag.GotInvitation) }}
                >{/*@once*/ inviteDisplay(invite)}</button>
              </li>
            ))}
            </ul>
          </ScrollIntoView>
        </Show>
      </form>
    </Match>
    <Match when={stateTag() === Tag.GotInvitation}>
      <ScrollIntoView alignBlock="start">
        <form name="rsvp" method="post" action="/" class="space-y-6" onsubmit={submit}>
          <input type="hidden" name="form-name" value="rsvp" />
          <Labeled label="Addressee">
            <div class="relative mr-4">
              <input
                type="text" readonly={true} name="addressee" value={invitation!.addressee}
                style="padding-right: calc(0.75rem * 2 + 5ch)"
                class="w-full"
              />
              <button
                type="button"
                class="interactive absolute inset-y-1 right-1 px-2 py-1 rounded hover:bg-teal-100"
                onclick={() => batch(() => { setErrorMsg(undefined); setStateTag(Tag.Initial) })}
              >Clear</button>
            </div>
          </Labeled>
          {
            invitation!.guests.length === 1
            ? <Single guest={/*@once*/ invitation!.guests[0]} />
            : <Multiple guests={/*@once*/ invitation!.guests} />
          }
          <Labeled class="mr-4" label="Message (optional)">
            <textarea name="message"></textarea>
          </Labeled>
          <Show when={errorMsg()}>
            <p>{errorMsg()}</p>
          </Show>
          <button type="submit" class="button button-teal">Submit</button>
        </form>
      </ScrollIntoView>
    </Match>
    <Match when={stateTag() === Tag.Submitted}>
      <p>Thank you for RSVPing!</p>
    </Match>
  </Switch>
}

function ScrollIntoView(props: { alignBlock?: "start" | "end" | "nearest", children: JSX.Element | JSX.Element[] }) {
  return (
    <div ref={(elem) => elem.scrollIntoView({ block: props.alignBlock || "nearest", inline: "nearest" })}>{props.children}</div>
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
