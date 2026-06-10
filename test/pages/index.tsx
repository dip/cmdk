import { Command } from 'cmdk'

const Page = () => {
  return (
    <div>
  
      <div style={{ height: '150vh' }}>
        <p>Scroll down for the Command</p>
      </div>

      <Command className="root">
        <Command.Input placeholder="Search…" className="input" />
        <Command.List className="list">
          <Command.Empty className="empty">No results.</Command.Empty>
          <Command.Item
            keywords={['key']}
            onSelect={() => {
              ;(window as any).onSelect = 'Item selected'
            }}
            className="item"
          >
            Item
          </Command.Item>
          <Command.Item value="xxx" className="item">
            Value
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page