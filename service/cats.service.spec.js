import { validateFileContent } from './cats.service'

describe('Cats file service', () => {
  test('throw error on empty file', () => {
    const fileContent = ''

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  test('throw error if only one line', () => {
    const fileContent = 'Col1;Col2'

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  test("throw error if lines doesn't have same columns count", () => {
    const fileContent = 'Col1;Col2\nTest1;Test2;Test3'

    const { error, result } = validateFileContent(fileContent)

    expect(error).not.toBeUndefined()
    expect(result).toBeUndefined()
  })

  test('can extract data', () => {
    const fileContent = 'Col1;Col2\nTest1;Test2\nTest3;Test4'

    const { error, result } = validateFileContent(fileContent)

    expect(error).toBeUndefined()
    expect(result).not.toBeUndefined()
  })
})
