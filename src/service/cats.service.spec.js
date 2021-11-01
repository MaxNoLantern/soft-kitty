import { computeHeaders, validateFileContent, mapRows } from './cats.service'

describe('Cats service', () => {
  it('throw error on empty file', () => {
    const fileContent = ''

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  it('throw error if only one line', () => {
    const fileContent = 'Col1;Col2'

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  it("throw error if lines doesn't have same columns count", () => {
    const fileContent = 'Col1;Col2\nTest1;Test2;Test3'

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  it('can extract data', () => {
    const fileContent = 'Col1;Col2\nTest1;Test2\nTest3;Test4'
    const expected = [
      ['Col1', 'Col2'],
      ['Test1', 'Test2'],
      ['Test3', 'Test4'],
    ]

    const { error, result } = validateFileContent(fileContent)

    expect(error).toBeUndefined()
    expect(result).not.toBeUndefined()
    expect(result).toEqual(expected)
  })

  it('can extarct headers', () => {
    const fileContent = [
      ['Nom', 'Prix'],
      ['Vaiana', '100,00'],
      ['Zilou', '10,00'],
    ]
    const expected = ['name', 'price']

    const headers = computeHeaders(fileContent[0])

    expect(headers).not.toBeUndefined()
    expect(headers).toEqual(expected)
  })

  it('can extarct headers in different order', () => {
    const fileContent = [
      ['Prix', 'Nom'],
      ['Vaiana', '100,00'],
      ['Zilou', '10,00'],
    ]
    const expected = ['price', 'name']

    const headers = computeHeaders(fileContent[0])

    expect(headers).not.toBeUndefined()
    expect(headers).toEqual(expected)
  })

  it('can build cat', () => {
    const fileContent = [
      ['Vaiana', '100,00'],
      ['Zilou', '10,00'],
    ]
    const headers = ['name', 'price']

    const cats = mapRows(headers, fileContent)

    expect(cats).not.toBeUndefined()
    expect(cats).toHaveLength(2)
    expect(cats).toContainEqual({ name: 'Vaiana', price: 100.0 })
    expect(cats).toContainEqual({ name: 'Zilou', price: 10.0 })
  })

  it('can build cat with different column', () => {
    const fileContent = [
      ['100,00', 'Vaiana'],
      ['10,00', 'Zilou'],
    ]
    const headers = ['price', 'name']

    const cats = mapRows(headers, fileContent)

    expect(cats).not.toBeUndefined()
    expect(cats).toHaveLength(2)
    expect(cats).toContainEqual({ name: 'Vaiana', price: 100.0 })
    expect(cats).toContainEqual({ name: 'Zilou', price: 10.0 })
  })
})
