import { Command } from 'cmdk'
import * as React from 'react'

// 50 fixed-height items in a short, scrollable list. Zero-padded, distinct values
// so a search can narrow to a single item far down the list, then broaden back.
const items = Array.from({ length: 50 }, (_, i) => `item-${String(i).padStart(2, '0')}`)

const Page = () => {
  return (
    <Command>
      <Command.Input placeholder="Search…" />
      <Command.List style={{ height: 120, overflow: 'auto' }}>
        {items.map((value) => (
          <Command.Item key={value} value={value} style={{ height: 30 }}>
            {value}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  )
}

export default Page
