var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '../styles/withStyles';

export const styles = theme => ({
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
});

/**
 * @ignore - internal component.
 */
function Backdrop(props) {
  const { classes, className: classNameProp, invisible } = props,
        other = _objectWithoutProperties(props, ['classes', 'className', 'invisible']);

  const className = classNames(classes.root, {
    [classes.invisible]: invisible
  }, classNameProp);

  return React.createElement('div', _extends({ 'data-mui-test': 'Backdrop', className: className, 'aria-hidden': 'true' }, other));
}

Backdrop.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * If `true`, the backdrop is invisible.
   */
  invisible: PropTypes.bool
};

Backdrop.defaultProps = {
  invisible: false
};

export default withStyles(styles, { name: 'MuiBackdrop' })(Backdrop);