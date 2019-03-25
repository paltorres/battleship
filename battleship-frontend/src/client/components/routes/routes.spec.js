import React from 'react'
import { mount } from 'enzyme'
import Wrapper from '../Wrapper/Wrapper'
import { MemoryRouter } from 'react-router-dom'
import Index from './index'
import Todos from '../Todos/Todos'

describe('<Index />', () => {
  it('should render correctly', () => {
    let component = mount(
      <Wrapper>
        <MemoryRouter>
          <Index />
        </MemoryRouter>
      </Wrapper>
    )

    expect(component).toMatchSnapshot()

    component.unmount()
  })

  it('should render Todos component when location is "/"', () => {
    let component = mount(
      <Wrapper>
        <MemoryRouter
          initialEntries={[ '/' ]}
          initialIndex={1}
        >
          <Index />
        </MemoryRouter>
      </Wrapper>
    )

    expect(component.find(Todos)).toHaveLength(1)

    component.unmount()
  })
})
