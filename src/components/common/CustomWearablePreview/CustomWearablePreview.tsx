import { useCallback, useEffect, useMemo, useState } from 'react'
import { PreviewEmote } from '@dcl/schemas'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { WearablePreview } from 'decentraland-ui/dist/components/WearablePreview/WearablePreview'
import { Props } from './CustomWearablePreview.types'
import './CustomWearablePreview.css'

export const CustomWearablePreview = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => setIsLoading(true), [props.profile])

  const platformDefinition = useMemo(() => {
    const getRepresentation = (bodyShape: 'BaseMale' | 'BaseFemale') => {
      const mainFile = 'platform.glb'
      const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin
      
      return {
        bodyShapes: [`urn:decentraland:off-chain:base-avatars:${bodyShape}`],
        mainFile,
        contents: [
          {
            key: mainFile,
            url: `${baseUrl}/misc/platform/${mainFile}`
          }
        ]
      }
    }

    return btoa(
      JSON.stringify({
        data: {
          representations: [getRepresentation('BaseMale'), getRepresentation('BaseFemale')]
        }
      })
    )
  }, [])

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
        base64s={[platformDefinition]}
        onLoad={handleOnLoad}
      />
      {isLoading ? <Loader active={true} size="huge" /> : null}
    </div>
  )
}
