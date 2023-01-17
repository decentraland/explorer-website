import React from 'react'
import { Meta, Story } from '@storybook/react'
import { LoadingRender } from './LoadingRender'

export default {
  title: 'Explorer/base/LoadingRender',
  args: {},
  component: LoadingRender
} as Meta

export const Template: Story<{}> = () => <LoadingRender />
