import React from 'react'
import { mount } from 'enzyme'
import Wrapper from '../Wrapper/Wrapper'
import Index from './index'

describe('<Index />', () => {
  it('should render correctly', () => {
    let component = mount(
      <Wrapper>
        <Index><div /></Index>
      </Wrapper>
    )

    expect(component).toMatchSnapshot()

    component.unmount()
  })
})
