// @flow
import 'test-utils/dev-mode'
import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Global, keyframes, css, withEmotionCache } from '@emotion/core'

const ClearCache = withEmotionCache((props, cache) => {
  cache.sheet.flush()
  return null
})

beforeAll(() => {
  // $FlowFixMe
  document.body.innerHTML = `<div id="root"></div>`
})

afterEach(() => {
  const root = ((document.getElementById('root'): any): Element)
  render(<ClearCache />, root)
  unmountComponentAtNode(root)
})

test('basic', () => {
  render(
    <Global
      styles={[
        {
          html: {
            backgroundColor: 'hotpink'
          },
          h1: {
            animation: `${keyframes({
              'from,to': {
                color: 'green'
              },
              '50%': {
                color: 'hotpink'
              }
            })} 1s`
          },
          '@font-face': {
            fontFamily: 'some-name'
          }
        },
        css`
          @import url('something.com/file.css');
        `
      ]}
    />,
    // $FlowFixMe
    document.getElementById('root')
  )
  expect(document.head).toMatchSnapshot()
  expect(document.body).toMatchSnapshot()
  unmountComponentAtNode(document.getElementById('root'))
  expect(document.head).toMatchSnapshot()
  expect(document.body).toMatchSnapshot()
})

test('updating more than 1 global rule', () => {
  const renderComponent = ({ background, color }) =>
    render(
      <Global styles={{ body: { background }, div: { color } }} />,
      // $FlowFixMe
      document.getElementById('root')
    )

  renderComponent({ background: 'white', color: 'black' })
  expect(document.head).toMatchSnapshot()
  renderComponent({ background: 'gray', color: 'white' })
  expect(document.head).toMatchSnapshot()
})
