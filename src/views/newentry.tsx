import "./newentry.css"
import {
  withTargetValue,
  withEnterKey,
  withFocus,
} from "@/lib/event-decorators"
import { IconButton } from "@/lib/buttons/icon-button"
import { AddNewItem, InputNewEntry } from "@/main"

export type NewEntryProps = {
  value: string
}

export function NewEntry(props: NewEntryProps) {
  return (
    <div class="newentry">
      <input
        type="text"
        class="newentry__input"
        value={props.value}
        oninput={withTargetValue(InputNewEntry)}
        onkeypress={withEnterKey(AddNewItem)}
      />
      <IconButton
        onclick={withFocus(".newentry__input", AddNewItem)}
        icon="plus"
        class="newentry__add-button"
      />
    </div>
  )
}
