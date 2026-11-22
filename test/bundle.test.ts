import { expect, test } from '@playwright/test'
import { build, transformSync } from 'esbuild'
import { runInNewContext } from 'node:vm'

async function bundle(contents: string) {
  const result = await build({
    stdin: { contents, resolveDir: __dirname },
    bundle: true,
    format: 'esm',
    minify: true,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    metafile: true,
    write: false,
  })
  const inputs = Object.entries(Object.values(result.metafile.outputs)[0].inputs)
    .filter(([, input]) => input.bytesInOutput > 0)
    .map(([path]) => path)
  const module = { exports: {} as any }
  runInNewContext(transformSync(result.outputFiles[0].text, { format: 'cjs' }).code, { module, require })
  return { inputs, exports: module.exports }
}

test('named non-dialog imports exclude Radix Dialog from the built package', async () => {
  const result = await bundle(`export { CommandRoot, CommandInput, CommandList, CommandItem } from 'cmdk'`)

  expect(result.inputs.some((path) => path.endsWith('cmdk/dist/index.mjs'))).toBe(true)
  expect(result.inputs.filter((path) => path.includes('@radix-ui/react-dialog/'))).toEqual([])
  for (const name of ['CommandRoot', 'CommandInput', 'CommandList', 'CommandItem']) {
    expect(typeof result.exports[name].render).toBe('function')
  }
})

for (const name of ['CommandDialog', 'Command']) {
  test(`${name} retains Radix Dialog`, async () => {
    const result = await bundle(`export { ${name} } from 'cmdk'`)

    expect(result.inputs.some((path) => path.includes('@radix-ui/react-dialog/'))).toBe(true)
    const dialog = name === 'Command' ? result.exports.Command.Dialog : result.exports.CommandDialog
    expect(typeof dialog.render).toBe('function')
  })
}

for (const format of ['esm', 'cjs']) {
  test(`preserves named and namespace export identities in ${format}`, async () => {
    const exports = format === 'esm' ? (await bundle("export * from 'cmdk'")).exports : require('cmdk')

    expect(exports.Command).toBe(exports.CommandRoot)
    for (const part of ['List', 'Item', 'Input', 'Group', 'Separator', 'Dialog', 'Empty', 'Loading']) {
      expect(exports.Command[part]).toBe(exports[`Command${part}`])
      expect(typeof exports.Command[part].render).toBe('function')
    }
    expect(typeof exports.useCommandState).toBe('function')
    expect(exports.defaultFilter('apple', 'apple')).toBe(1)
  })
}
