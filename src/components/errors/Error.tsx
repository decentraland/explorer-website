import * as React from 'react'
import classNames from '../../utils/classNames'
import './errors.css'

export const ErrorContainer = React.memo(function ({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div {...props} className={classNames(['error-container', className])}>
    <div className="error-background" />
    <div className="error-content">{children}</div>
  </div>
})

export type DetailsProps = React.HTMLProps<HTMLDivElement> & {
  header?: React.ReactNode,
  backgroundHeader?: React.ReactNode,
  description?: React.ReactNode,
}

export const ErrorDetails = React.memo(function ({ className, header, description, backgroundHeader, children, ...props }: DetailsProps) {
  return <div {...props} className={classNames(['error-details', className])}>
    {backgroundHeader && <div className="error-background-title">{backgroundHeader}</div>}
    <div className="error-title">{header || 'Something went wrong'}</div>
    {description && <div className="error-description">{description}</div>}
    {children && <div className="error-cta">{children}</div>}
  </div>
})

export const ErrorImage = React.memo(function ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <div className={classNames(['error-image', className])}>
    <img alt="error" {...props} />
  </div>
})
