import React from 'react'
import { Meta, Story } from '@storybook/react'
import { ErrorContainer, ErrorContainerProps } from './ErrorContainer'

export default {
  title: 'Explorer/Errors',
  args: {
    error: {}
  } as ErrorContainerProps,
  component: ErrorContainer
} as Meta

const Template: Story<ErrorContainerProps> = (args) => <ErrorContainer {...args} />
export const FatalError = Template.bind({})
FatalError.args = {
  ...Template.args
}