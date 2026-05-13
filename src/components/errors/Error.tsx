import * as React from 'react'
import {
  ErrorContainerEl,
  ErrorBackground,
  ErrorContent,
  ErrorDetailsEl,
  ErrorImageEl,
  ErrorBackgroundTitle,
  ErrorTitle,
  ErrorDescription,
  ErrorCta
} from './Error.styled'

export const ErrorContainer = React.memo(function ({
  className,
  children,
  as: _as,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <ErrorContainerEl {...props} className={className}>
      <ErrorBackground />
      <ErrorContent className="error-content">{children}</ErrorContent>
    </ErrorContainerEl>
  )
})

export type DetailsProps = React.HTMLProps<HTMLDivElement> & {
  header?: React.ReactNode
  backgroundHeader?: React.ReactNode
  description?: React.ReactNode
}

export const ErrorDetails = React.memo(function ({
  className,
  header,
  description,
  backgroundHeader,
  children,
  as: _as,
  ...props
}: DetailsProps) {
  return (
    <ErrorDetailsEl {...props} className={className}>
      {backgroundHeader && <ErrorBackgroundTitle>{backgroundHeader}</ErrorBackgroundTitle>}
      <ErrorTitle>{header || 'Something went wrong'}</ErrorTitle>
      {description && <ErrorDescription>{description}</ErrorDescription>}
      {children && <ErrorCta>{children}</ErrorCta>}
    </ErrorDetailsEl>
  )
})

export const ErrorImage = React.memo(function ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <ErrorImageEl className={['error-image', className].filter(Boolean).join(' ')}>
      <img alt="error" {...props} />
    </ErrorImageEl>
  )
})
