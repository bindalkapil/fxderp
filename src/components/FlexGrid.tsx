import * as React from 'react';
import Box, { type BoxProps } from '@mui/material/Box';

type GridProps = BoxProps & {
  container?: boolean;
  item?: boolean;
  xs?: number | 'auto' | true | false;
  sm?: number | 'auto' | true | false;
  md?: number | 'auto' | true | false;
  lg?: number | 'auto' | true | false;
  xl?: number | 'auto' | true | false;
  spacing?: number;
};

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 0,
  sx,
  ...props
}, ref) => {
  const breakpointProps = { xs, sm, md, lg, xl } as const;
  
  const responsiveStyles = breakpoints.reduce((acc, breakpoint) => {
    const value = breakpointProps[breakpoint];
    if (value === undefined) return acc;
    
    if (value === true) {
      // When true, it means the item should take up all available space
      acc[`@media (min-width: ${breakpoint === 'xs' ? 0 : breakpoint === 'sm' ? 600 : breakpoint === 'md' ? 900 : breakpoint === 'lg' ? 1200 : 1536}px)`] = {
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: '100%',
      };
    } else if (value === 'auto') {
      // When 'auto', it means the item should take up as much space as its content
      acc[`@media (min-width: ${breakpoint === 'xs' ? 0 : breakpoint === 'sm' ? 600 : breakpoint === 'md' ? 900 : breakpoint === 'lg' ? 1200 : 1536}px)`] = {
        flexGrow: 0,
        flexBasis: 'auto',
        maxWidth: 'none',
      };
    } else if (typeof value === 'number') {
      // When a number, it represents the number of columns out of 12
      const width = `${Math.round((value / 12) * 100)}%`;
      acc[`@media (min-width: ${breakpoint === 'xs' ? 0 : breakpoint === 'sm' ? 600 : breakpoint === 'md' ? 900 : breakpoint === 'lg' ? 1200 : 1536}px)`] = {
        flexGrow: 0,
        flexBasis: width,
        maxWidth: width,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  const styles = {
    ...(container && {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      margin: spacing ? `-${spacing / 2}px` : 0,
      '& > *': {
        padding: spacing ? `${spacing / 2}px` : 0,
      },
    }),
    ...(item && {
      boxSizing: 'border-box',
      margin: 0,
      ...responsiveStyles,
    }),
  };

  return (
    <Box
      ref={ref}
      sx={[styles, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
});

Grid.displayName = 'Grid';

export default Grid;
