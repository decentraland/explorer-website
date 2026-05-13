import { useCallback } from 'react'
import { useTranslation } from '@dcl/hooks'

function useFormatMessage() {
  const { t } = useTranslation()

  return useCallback(
    function format(id?: string | null, values?: Record<string, string | number>): string {
      if (!id) {
        return ''
      }
      return t(id, values)
    },
    [t]
  )
}

function useIntl() {
  const { intl } = useTranslation()
  return intl
}

export { useFormatMessage, useIntl }
