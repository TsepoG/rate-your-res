import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

// Base block — use $dark for elements on dark/coloured backgrounds (e.g. hero sections)
export const SkeletonBlock = styled.div`
  background: ${({ $dark }) => $dark
    ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 75%)'
    : 'linear-gradient(90deg, #ececec 25%, #d8d8d8 50%, #ececec 75%)'
  };
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ $radius }) => $radius || '8px'};
  width: ${({ $w }) => $w || '100%'};
  height: ${({ $h }) => $h || '16px'};
  flex-shrink: 0;
`

// Circle — for avatars and logos
export const SkeletonCircle = styled(SkeletonBlock)`
  border-radius: 50%;
  width: ${({ $size }) => $size || '48px'};
  height: ${({ $size }) => $size || '48px'};
`

// Short text line
export const SkeletonText = styled(SkeletonBlock)`
  height: 14px;
  border-radius: 6px;
  width: ${({ $w }) => $w || '60%'};
`
