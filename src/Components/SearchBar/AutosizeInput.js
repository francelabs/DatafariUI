import React, { useState, useRef } from 'react';

const AutosizeInput = (props) => {
  const sizerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    visibility: 'hidden',
    height: 0,
    overflow: 'scroll',
    whiteSpace: 'pre',
  };

  const INPUT_PROPS_BLACKLIST = [
    'extraWidth',
    'injectStyles',
    'inputClassName',
    'inputRef',
    'inputStyle',
    'minWidth',
    'onAutosize',
    'placeholderIsMinWidth',
  ];

  const isIE =
    typeof window !== 'undefined' && window.navigator
      ? /MSIE |Trident\/|Edge\//.test(window.navigator.userAgent)
      : false;

  const placeHolderSizerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(props.minWidth);
  const [inputId, setInputId] = useState(props.id) || generateId();

  let sizer, mounted, placeHolderSizer;

  const cleanInputProps = (inputProps) => {
    INPUT_PROPS_BLACKLIST.forEach((field) => delete inputProps[field]);
    return inputProps;
  };

  const copyStyles = (styles, node) => {
    node.style.fontSize = styles.fontSize;
    node.style.fontFamily = styles.fontFamily;
    node.style.fontWeight = styles.fontWeight;
    node.style.fontStyle = styles.fontStyle;
    node.style.letterSpacing = styles.letterSpacing;
    node.style.textTransform = styles.textTransform;
  };

  const updateInputWidth = () => {
    if (!mounted || !sizer || typeof sizer.scrollWidth === 'undefined') {
      return;
    }
    let newInputWidth;
    if (
      props.placeholder &&
      (!props.value || (props.value && props.placeholderIsMinWidth))
    ) {
      newInputWidth =
        Math.max(sizer.scrollWidth, placeHolderSizer.scrollWidth) + 2;
    } else {
      newInputWidth = sizer.scrollWidth + 2;
    }
    // add extraWidth to the detected width. for number types, this defaults to 16 to allow for the stepper UI
    const extraWidth =
      props.type === 'number' && props.extraWidth === undefined
        ? 16
        : parseInt(props.extraWidth) || 0;
    newInputWidth += extraWidth;
    if (newInputWidth < props.minWidth) {
      newInputWidth = props.minWidth;
    }
    if (newInputWidth !== inputWidth) {
      setInputWidth(newInputWidth);
    }
  };

  const generateId = () => {
    // we only need an auto-generated ID for stylesheet injection, which is only
    // used for IE. so if the browser is not IE, this should return undefined.
    return isIE ? '_' + Math.random().toString(36).substr(2, 12) : undefined;
  };

  return (
    <div className={props.className} style={wrapperStyle}>
      {renderStyles()}
      <input {...inputProps} ref={inputRef} />
      <div ref={sizerRef} style={sizerStyle}>
        {sizerValue}
      </div>
      {props.placeholder ? (
        <div ref={placeHolderSizerRef} style={sizerStyle}>
          {props.placeholder}
        </div>
      ) : null}
    </div>
  );
};

export default AutosizeInput;
