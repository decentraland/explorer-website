import { useCallback, useEffect, useMemo, useState } from 'react'
import { PreviewEmote } from '@dcl/schemas'
import { CircularProgress, WearablePreview } from 'decentraland-ui2'
import { Props } from './CustomWearablePreview.types'
import { PreviewWrapper, LoaderOverlay } from './CustomWearablePreview.styled'

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
    <PreviewWrapper>
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
      {isLoading ? (
        <LoaderOverlay>
          <CircularProgress size={80} sx={{ color: 'white' }} />
        </LoaderOverlay>
      ) : null}
    </PreviewWrapper>
  )
}
