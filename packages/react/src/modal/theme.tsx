import { extendTheme } from '@chakra-ui/react';

// global theme
const theme = extendTheme({
  styles: {
    global: () => ({
      html: {
        fontFamily: '',
        transitionProperty: '',
        transitionDuration: '',
        lineHeight: '',
        WebkitTextSizeAdjust: '100%',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        MozOsxFontSmoothing: 'grayscale',
        touchAction: 'manipulation',
      },
      body: {
        fontFamily: '',
        color: '',
        bg: '',
        position: 'relative',
        minHeight: '100%',
        fontFeatureSettings: 'kern',
      },
      '*::placeholder': {
        color: '',
      },
      '*, *::before, *::after': {
        borderWidth: 0,
        borderStyle: 'solid',
        boxSizing: 'border-box',
      },
      '*, *::before, &::after': {
        borderColor: '',
        wordWrap: '',
      },
      main: {
        display: 'block',
      },
      hr: {
        borderTopWidth: '1px',
        boxSizing: 'content-box',
        height: 0,
        overflow: 'visible',
      },
      'pre, code, kbd, samp': {
        fontFamily: '',
        fontSize: '',
      },
      a: {
        backgroundColor: 'transparent',
        color: 'inherit',
        textDecoration: 'inherit',
      },
      'abbr[title]': {
        borderBottom: 'none',
        WebkitTextDecoration: 'underline dotted',
        textDecoration: 'underline dotted',
      },
      'b, strong': {
        fontWeight: 'bold',
      },
      small: {
        fontSize: '80%',
      },
      'sub, sup': {
        fontSize: '75%',
        lineHeight: 0,
        position: 'relative',
        verticalAlign: 'baseline',
      },
      sub: {
        bottom: '-0.25em',
      },
      sup: {
        top: '-0.5em',
      },
      img: {
        borderStyle: 'none',
      },
      'button, input, optgroup, select,textarea': {
        fontFamily: 'inherit',
        fontSize: '100%',
        lineHeight: 1.15,
        margin: 0,
      },
      'button, input': {
        overflow: 'visible',
      },
      'button, select': {
        textTransform: 'none',
      },
      'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner':
        {
          borderStyle: 'none',
          padding: 0,
        },
      fieldset: {
        margin: 0,
        padding: 0,
      },
      legend: {
        boxSizing: 'border-box',
        color: 'inherit',
        display: 'table',
        maxWidth: '100%',
        padding: 0,
        whiteSpace: 'normal',
      },
      progress: {
        verticalAlign: 'baseline',
      },
      textarea: {
        overflow: 'auto',
        resize: 'vertical',
      },
      '[type="checkbox"], [type="radio"]': {
        boxSizing: 'border-box',
        padding: 0,
      },
      '[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button':
        {
          WebkitAppearance: 'none',
        },
      'input[type="number"]': {
        MozAppearance: 'textfield',
      },
      '[type="search"]': {
        '-webkit-appearance': 'none',
        outlineOffset: '-2px',
      },
      '[type="search"]::-webkit-search-decoration': {
        WebkitAppearance: 'none',
      },
      '::-webkit-file-upload-button': {
        WebkitAppearance: 'button',
        font: 'inherit',
      },
      details: {
        display: 'block',
      },
      summary: {
        display: 'list-item',
      },
      template: {
        display: 'none',
      },
      '[hidden]': {
        display: 'none',
      },
      'body, blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
        margin: 0,
      },
      button: {
        background: '',
        padding: 0,
      },
      'button,[role="button"]': {
        cursor: 'pointer',
      },
      'button::-moz-focus-inner': {
        border: 0,
      },
      table: {
        borderCollapse: 'collapse',
      },
      'ol, ul': {
        margin: 0,
        padding: 0,
      },
      'h1, h2, h3, h4, h5, h6': {
        fontSize: 'inherit',
        fontWeight: 'inherit',
      },
      'button, input, optgroup, select, textarea': {
        padding: 0,
        lineHeight: 'inherit',
        color: 'inherit',
      },
      'img, svg, video, canvas, audio, iframe, embed, object': {
        display: 'block',
      },
      'img, video': {
        maxWidth: '100%',
        height: 'auto',
      },
      '[data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled])':
        {
          outline: 'none',
          boxShadow: 'none',
        },
      'select::-ms-expand': {
        display: 'none',
      },
    }),
  },
  colors: {
    primary: {
      '50': '#e5e7f9',
      '100': '#bec4ef',
      '200': '#929ce4',
      '300': '#6674d9',
      '400': '#4657d1',
      '500': '#2539c9',
      '600': '#2133c3',
      '700': '#1b2cbc',
      '800': '#1624b5',
      '900': '#0d17a9',
    },
  },
});

// old theme
// export const defaultThemeObject = {
//   fonts: {
//     body: 'Inter, system-ui, sans-serif',
//     heading: 'Work Sans, system-ui, sans-serif',
//   },
//   colors: {
//     primary: {
//       '50': '#e5e7f9',
//       '100': '#bec4ef',
//       '200': '#929ce4',
//       '300': '#6674d9',
//       '400': '#4657d1',
//       '500': '#2539c9',
//       '600': '#2133c3',
//       '700': '#1b2cbc',
//       '800': '#1624b5',
//       '900': '#0d17a9',
//     },
//   },
//   breakPoints: {
//     sm: '30em',
//     md: '48em',
//     lg: '62em',
//     xl: '80em',
//     '2xl': '96em',
//   },
//   shadows: {
//     largeSoft: 'rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;',
//   },
// };

// export const defaultTheme = extendTheme(defaultThemeObject);
export const defaultTheme = extendTheme(theme);
