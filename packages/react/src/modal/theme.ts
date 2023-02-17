import { extendTheme } from '@chakra-ui/react';

/* ====================================================== */
/*       NOTICE: Chakra resets global CSS by default      */
/* ====================================================== */

const colors = {
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
};

/* ----- this theme is for without Chakra CSS reset ----- */
const themeWithoutReset = {
  styles: {
    global: () => ({
      html: {
        fontFamily: '',
        transitionProperty: '',
        transitionDuration: '',
        lineHeight: '',
        WebkitTextSizeAdjust: '100%',
        WebkitFontSmoothing: '',
        textRendering: 'optimizeLegibility',
        MozOsxFontSmoothing: '',
        touchAction: 'manipulation',
      },
      body: {
        fontFamily: '',
        color: '',
        bg: '',
        position: 'relative',
        minHeight: '100%',
        fontFeatureSettings: '',
      },
      '*::placeholder': {
        color: '',
      },
      '*, *::before, *::after': {
        borderWidth: '',
        borderStyle: '',
        boxSizing: '',
      },
      '*, *::before, &::after': {
        borderColor: '',
        wordWrap: '',
      },
      main: {
        display: '',
      },
      hr: {
        borderTopWidth: '',
        boxSizing: '',
        height: '',
        overflow: '',
      },
      'pre, code, kbd, samp': {
        fontFamily: '',
        fontSize: '',
      },
      a: {
        backgroundColor: '',
        color: '',
        textDecoration: '',
      },
      'abbr[title]': {
        borderBottom: '',
        WebkitTextDecoration: '',
        textDecoration: '',
      },
      'b, strong': {
        fontWeight: '',
      },
      small: {
        fontSize: '',
      },
      'sub, sup': {
        fontSize: '',
        lineHeight: '',
        position: '',
        verticalAlign: '',
      },
      sub: {
        bottom: '',
      },
      sup: {
        top: '',
      },
      img: {
        borderStyle: '',
      },
      'button, input, optgroup, select,textarea': {
        fontFamily: '',
        fontSize: '',
        lineHeight: '',
        margin: '',
      },
      'button, input': {
        overflow: '',
      },
      'button, select': {
        textTransform: '',
      },
      'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner':
        {
          borderStyle: '',
          padding: '',
        },
      fieldset: {
        margin: '',
        padding: '',
      },
      legend: {
        boxSizing: '',
        color: '',
        display: '',
        maxWidth: '',
        padding: '',
        whiteSpace: '',
      },
      progress: {
        verticalAlign: '',
      },
      textarea: {
        overflow: '',
        resize: '',
      },
      '[type="checkbox"], [type="radio"]': {
        boxSizing: '',
        padding: '',
      },
      '[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button':
        {
          WebkitAppearance: '',
        },
      'input[type="number"]': {
        MozAppearance: '',
      },
      '[type="search"]': {
        '-webkit-appearance': '',
        outlineOffset: '',
      },
      '[type="search"]::-webkit-search-decoration': {
        WebkitAppearance: '',
      },
      '::-webkit-file-upload-button': {
        WebkitAppearance: '',
        font: '',
      },
      details: {
        display: '',
      },
      summary: {
        display: '',
      },
      template: {
        display: '',
      },
      '[hidden]': {
        display: '',
      },
      'body, blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
        margin: '',
      },
      button: {
        background: '',
        padding: '',
      },
      'button,[role="button"]': {
        cursor: '',
      },
      'button::-moz-focus-inner': {
        border: '',
      },
      table: {
        borderCollapse: '',
      },
      'ol, ul': {
        margin: '',
        padding: '',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontSize: '',
        fontWeight: '',
      },
      'button, input, optgroup, select, textarea': {
        padding: '',
        lineHeight: '',
        color: '',
      },
      'img, svg, video, canvas, audio, iframe, embed, object': {
        display: '',
      },
      'img, video': {
        maxWidth: '',
        height: '',
      },
      '[data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled])':
        {
          outline: '',
          boxShadow: '',
        },
      'select::-ms-expand': {
        display: '',
      },
    }),
  },
  ...colors,
};

/* ------- this theme is for with Chakra CSS reset ------ */
const themeWithReset = {
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Work Sans, system-ui, sans-serif',
  },
  ...colors,
};

export const defaultTheme = extendTheme(themeWithReset);

// noCssResetTheme removed most global css reset made by chakra
export const noCssResetTheme = extendTheme(themeWithoutReset);
