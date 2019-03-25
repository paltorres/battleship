import React from 'react'
import { mount } from 'enzyme'
import Wrapper from '../Wrapper/Wrapper'
import App from './app'

describe('<App />', () => {
  it('should render correctly', () => {
    let component = mount(
      <Wrapper>
        <App />
      </Wrapper>
    )

    expect(component).toMatchSnapshot()

    component.unmount()
  })
})
