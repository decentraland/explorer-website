import * as React from 'react'
import classJoin from '../../utils/classJoin'
import './errors.css'

export const Container = React.memo(function ({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div {...props} className={classJoin(['error-container', className])}>
    <div className="error-background" />
    <div className="error-content">{children}</div>
  </div>
})

export type DetailsProps = React.HTMLProps<HTMLDivElement> & {
  header?: React.ReactNode,
  backgroundHeader?: React.ReactNode,
  description?: React.ReactNode,
}

export const Details = React.memo(function ({ className, header, description, backgroundHeader, children, ...props }: DetailsProps) {
  return <div {...props} className={classJoin(['error-details', className])}>
    {backgroundHeader && <div className="error-background-title">{backgroundHeader}</div>}
    <div className="error-title">{header || 'Something went wrong'}</div>
    {description && <div className="error-description">{description}</div>}
    {children && <div className="error-cta">{children}</div>}
  </div>
})

export const Image = React.memo(function ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <div className={classJoin(['error-image', className])}>
    <img {...props} />
  </div>
})

export function reload() {
  window.location.reload()
}