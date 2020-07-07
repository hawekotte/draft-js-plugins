import React, {
  // PropTypes,
  Component,
} from 'react';
import emojione from 'emojione';
import emojiList from '../../../utils/emojiList';
import convertShortNameToUnicode from '../../../utils/convertShortNameToUnicode';

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.mouseDown = false;
    this.touchDown = false;
  }

  componentDidUpdate() {
    this.mouseDown = false;
    this.touchDown = false;
  }

  onTouchEnd = event => {
    event.preventDefault();

    // this fixes an issue with onMouseDown and onMouseUp events not firing on mobile devices, making it
    // difficult if not impossible to tap on entries to select them
    if (this.touchDown) {
      this.props.onEmojiSelect(this.props.emoji);
      this.touchDown = false;
    }
  };

  onTouchMove = event => {
    // Note: important to avoid a content edit change
    event.preventDefault();

    this.touchDown = false;
  };

  onTouchStart = event => {
    // Note: important to avoid a content edit change
    event.preventDefault();

    this.touchDown = true;
  };

  onMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.props.onEmojiSelect(this.props.emoji);
    }
  };

  onMouseDown = event => {
    // Note: important to avoid a content edit change
    event.preventDefault();

    this.mouseDown = true;
  };

  onMouseEnter = () => {
    this.props.onEmojiFocus(this.props.index);
  };

  render() {
    const {
      theme = {},
      imagePath,
      imageType,
      cacheBustParam,
      useNativeArt,
      isFocused,
      id,
    } = this.props;
    const className = isFocused
      ? theme.emojiSuggestionsEntryFocused
      : theme.emojiSuggestionsEntry;

    let emojiDisplay = null;
    if (useNativeArt === true) {
      const unicode = emojiList.list[this.props.emoji][0];
      emojiDisplay = convertShortNameToUnicode(unicode);
    } else {
      // short name to image url code steal from emojione source code
      const shortNameForImage =
        emojione.emojioneList[this.props.emoji].unicode[
          emojione.emojioneList[this.props.emoji].unicode.length - 1
        ];
      const fullImagePath = `${imagePath}${shortNameForImage}.${imageType}${cacheBustParam}`;
      emojiDisplay = (
        <img
          src={fullImagePath}
          className={theme.emojiSuggestionsEntryIcon}
          role="presentation"
        />
      );
    }

    return (
      <div
        className={className}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}
        // onMouseDown={this.onMouseDown}
        // onMouseUp={this.onMouseUp}
        // onMouseEnter={this.onMouseEnter}
        role="option"
        id={id}
        aria-selected={isFocused ? 'true' : null}
      >
        {emojiDisplay}
        <span className={theme.emojiSuggestionsEntryText}>
          {this.props.emoji}
        </span>
      </div>
    );
  }
}
