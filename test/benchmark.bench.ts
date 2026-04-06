import { bench } from 'vitest'
import toJson from '../src/xml2obj'
import fs from 'fs'
import path from 'path'

const xml = fs.readFileSync(path.join(__dirname, './fixtures/large.xml'), 'utf8')

bench('baseline', () => {
  toJson(xml)
})
