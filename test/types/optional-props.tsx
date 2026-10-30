import * as React from 'react'
import { Command } from 'cmdk'

// Check the built declarations as a consumer forwarding optional props would.
function ForwardedProps(props: { value?: string; disabled?: boolean; onSelect?: (value: string) => void }) {
  return <Command.Item value={props.value} disabled={props.disabled} onSelect={props.onSelect} />
}

const optionalProps = (
  <Command
    label={undefined}
    shouldFilter={undefined}
    filter={undefined}
    defaultValue={undefined}
    value={undefined}
    onValueChange={undefined}
    loop={undefined}
    disablePointerSelection={undefined}
    vimBindings={undefined}
  >
    <Command.Input value={undefined} onValueChange={undefined} />
    <Command.List label={undefined}>
      <Command.Group heading={undefined} value={undefined} forceMount={undefined}>
        <Command.Item
          value={undefined}
          disabled={undefined}
          onSelect={undefined}
          keywords={undefined}
          forceMount={undefined}
        />
      </Command.Group>
      <Command.Separator alwaysRender={undefined} />
      <Command.Loading progress={undefined} label={undefined} />
      <Command.Empty />
    </Command.List>
  </Command>
)

const dialogProps = <Command.Dialog overlayClassName={undefined} contentClassName={undefined} container={undefined} />
const omittedProps = (
  <Command>
    <Command.Input />
    <Command.List>
      <Command.Item />
    </Command.List>
  </Command>
)

const callbacks = (
  <Command
    filter={(value, search, keywords) => (value.includes(search) || keywords?.includes(search) ? 1 : 0)}
    onValueChange={(value) => value.toUpperCase()}
  >
    <Command.Input onValueChange={(search) => search.toUpperCase()} />
    <Command.Item onSelect={(value) => value.toUpperCase()} />
  </Command>
)

// @ts-expect-error Optional does not mean arbitrary values are accepted.
const invalidValue = <Command.Item value={123} />
// @ts-expect-error Callbacks still receive a string.
const invalidCallback = <Command.Item onSelect={(value: number) => {}} />
// @ts-expect-error Filters must return a numeric score, not undefined.
const invalidFilter = <Command filter={() => undefined} />

void [ForwardedProps, optionalProps, dialogProps, omittedProps, callbacks, invalidValue, invalidCallback, invalidFilter]
