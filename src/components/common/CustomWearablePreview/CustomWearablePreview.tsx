import { useCallback, useEffect, useState } from 'react'
import { PreviewEmote } from '@dcl/schemas'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { Props } from './CustomWearablePreview.types'
import './CustomWearablePreview.css'

const PLATFORM_DEFINITION_URL = `${window.location.origin}/misc/platform/platformDefinition.json`

export const CustomWearablePreview = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => setIsLoading(true), [props.profile])

  const handleOnLoad = useCallback(() => setIsLoading(false), [])

  return (
    <div className="CustomWearablePreview">
      <WearablePreview
        lockBeta={true}
        panning={false}
        disableBackground={true}
        profile={props.profile}
        dev={false}
        emote={PreviewEmote.WAVE}
        disableAutoRotate
        cameraY={0.2}
        urls={[PLATFORM_DEFINITION_URL]}
        onLoad={handleOnLoad}
      />
      {isLoading ? <Loader active={true} size="huge" /> : null}
    </div>
  )
}
