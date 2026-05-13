import { BubbleLink, BubbleIcon, BubbleText, BubbleBoldLine } from './CommunityBubble.styled'
import { useFormatMessage } from '../../../hooks/useFormatMessage'

type Props = {
  className?: string
  i18n?: {
    title: string
    subtitle: string
  }
}

export const CommunityBubble = ({ className, i18n }: Props) => {
  const l = useFormatMessage()
  return (
    <BubbleLink className={className} href="https://decentraland.org/discord" target="_blank" rel="noopener noreferrer">
      <BubbleIcon />
      <BubbleText>
        <span>{i18n?.title ?? l('community_bubble.title')}</span>
        <BubbleBoldLine>{i18n?.subtitle ?? l('community_bubble.subtitle')}</BubbleBoldLine>
      </BubbleText>
    </BubbleLink>
  )
}
