import { describe, expect, it } from 'vitest'
import { cases } from './cases'

describe('case library', () => {
  it('contains a varied library of safe fictional reports', () => {
    expect(cases.length).toBeGreaterThanOrEqual(50)
    expect(new Set(cases.map(item => item.location)).size).toBeGreaterThan(3)
    expect(cases.every(item => item.choices.some(choice => choice.correct))).toBe(true)
  })
})
