import { expect, test } from 'vitest'
import fs from 'fs'
import objToXml from '../src/obj2xml'
import toJson from '../src/xml2obj'
import path from 'path'

const readFixture = (file: string, parseObj = false) => {
  const _file = fs.readFileSync(path.join(__dirname, '/fixtures/', file), { encoding: 'utf-8' })
  if (parseObj) return JSON.parse(_file)
  return _file
}

test('does json unsanitize', function () {
  const json = JSON.parse(readFixture('xmlsanitize.json'))
  const result = objToXml(json, { sanitize: true })
  const xml = readFixture('xmlsanitize.xml')

  expect(result).toEqual(xml)

  return Promise.resolve()
})
test('does json unsanitize of text', function () {
  const json = readFixture('xmlsanitize2.json', true)
  const result = objToXml(json, { sanitize: true })
  const xml = readFixture('xmlsanitize2.xml')

  expect(result).toEqual(xml)

  return Promise.resolve()
})
test('does doesnt double sanitize', function () {
  const json = readFixture('xmlsanitize3.json', true)
  const result = objToXml(json, { sanitize: true })
  const xml = readFixture('xmlsanitize3.xml')

  expect(result).toEqual(xml)

  return Promise.resolve()
})
test('converts domain to json', function () {
  const json = readFixture('domain-reversible.json', true)
  const result = objToXml(json)
  const xml = readFixture('domain.xml')

  expect(result + '\n').toEqual(xml)

  return Promise.resolve()
})
test('ignore null properties {ignoreNull: true}', function () {
  const json = readFixture('null-properties.json', true)
  const expectedXml = readFixture('null-properties-ignored.xml')

  const xml = objToXml(json, { ignoreNull: true })
  expect(xml).toEqual(expectedXml)

  return Promise.resolve()
})
test('don\'t ignore null properties (default)', function () {
  const json = JSON.parse(readFixture('null-properties.json'))
  const expectedXml = readFixture('null-properties-not-ignored.xml')

  const xml = objToXml(json)
  expect(xml).toEqual(expectedXml)

  return Promise.resolve()
})

test('correctly reverses using alternateTextNode', () => {
  const xmlStr = '<foo attr="value">bar<subnode val="test">glass</subnode></foo>'
  const json = toJson(xmlStr, {
    reversible: true,
    textNode: '___test',
    trim: false
  })
  const xml = objToXml(json, { textNode: '___test' })
  expect(xmlStr).toEqual(xml)
})
