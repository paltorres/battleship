import React from 'react'
import { mount } from 'enzyme'
import Index from './index'
import Helmet from 'react-helmet'

describe('<Index />', () => {
  it('should render correctly', () => {
    let component = mount(
      <Index />
    )

    expect(component).toMatchSnapshot()

    component.unmount()
  })

  it('should contain title tag with text "Testing environment"', () => {
    let component = mount(
      <Index />
    )

    expect(Helmet.peek().title).toEqual('Testing environment')

    component.unmount()
  })
})
