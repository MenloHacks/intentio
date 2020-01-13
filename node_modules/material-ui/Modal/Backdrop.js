'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withStyles = require('../styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = exports.styles = function styles(theme) {
  return {
    root: {
      zIndex: -1,
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      // Remove grey highlight
      WebkitTapHighlightColor: theme.palette.common.transparent,
      backgroundColor: theme.palette.common.lightBlack,
      transition: theme.transitions.create('opacity'),
      willChange: 'opacity',
      opacity: 0
    },
    invisible: {
      backgroundColor: theme.palette.common.transparent
    }
  };
};

/**
 * @ignore - internal component.
 */
function Backdrop(props) {
  var classes = props.classes,
      classNameProp = props.className,
      invisible = props.invisible,
      other = (0, _objectWithoutProperties3.default)(props, ['classes', 'className', 'invisible']);


  var className = (0, _classnames2.default)(classes.root, (0, _defineProperty3.default)({}, classes.invisible, invisible), classNameProp);

  return _react2.default.createElement('div', (0, _extends3.default)({ className: className, 'aria-hidden': 'true' }, other));
}

Backdrop.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * Useful to extend the style applied to components.
   */
  classes: _propTypes2.default.object.isRequired,
  /**
   * @ignore
   */
  className: _propTypes2.default.string,
  /**
   * If `true`, the backdrop is invisible.
   */
  invisible: _propTypes2.default.bool
} : {};

Backdrop.defaultProps = {
  invisible: false
};

exports.default = (0, _withStyles2.default)(styles, { name: 'MuiBackdrop' })(Backdrop);