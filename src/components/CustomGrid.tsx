import { styled } from '@mui/material/styles';

// Custom Grid container component
export const GridContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  '& > *': {
    boxSizing: 'border-box',
  },
});

// Custom Grid item component with responsive width
export const GridItem = styled('div', {
  shouldForwardProp: (prop) => prop !== 'xs' && prop !== 'md',
})<{ xs?: number | string; md?: number | string }>(
  ({ theme, xs = 12, md }) => ({
    width: '100%',
    padding: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      width: typeof xs === 'number' ? `${(xs / 12) * 100}%` : xs,
    },
    [theme.breakpoints.up('md')]: {
      width: md ? (typeof md === 'number' ? `${(md / 12) * 100}%` : md) : '100%',
    },
  })
);
