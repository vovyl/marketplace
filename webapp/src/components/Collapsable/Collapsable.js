import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { t } from '@dapps/modules/translation/utils'

import './Collapsable.css'

export default class Collapsable extends React.PureComponent {
  static propTypes = {
    maxHeight: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props)

    this.wrapperElement = null
    this.debouncedSetCollapsableUsingHeight = debounce(
      this.setCollapsableUsingHeight,
      100
    )

    this.state = {
      isCollapsed: true,
      isCollapsable: false
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.debouncedSetCollapsableUsingHeight)
    this.setCollapsableUsingHeight()
  }

  componentWillReceiveProps() {
    this.setCollapsableUsingHeight()
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.debouncedSetCollapsableUsingHeight
    )
  }

  handleToggleSeeMore = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed })
  }

  setWrapperElement = wrapperElement => {
    this.wrapperElement = wrapperElement
    this.setCollapsableUsingHeight()
  }

  setCollapsableUsingHeight = () => {
    if (!this.wrapperElement) return

    const isCollapsable =
      this.wrapperElement.offsetHeight > this.props.maxHeight

    if (isCollapsable !== this.state.isCollapsable) {
      this.setState({ isCollapsable })
    }
  }

  render() {
    const { maxHeight, children } = this.props
    const { isCollapsable, isCollapsed } = this.state

    return (
      <div className="Collapsable">
        <div
          className="collapsable-wrapper"
          style={{
            maxHeight: isCollapsable && isCollapsed ? `${maxHeight}px` : '100%'
          }}
        >
          <div className="collapsable-content" ref={this.setWrapperElement}>
            {children}
          </div>
        </div>
        {isCollapsable ? (
          <div className="see-more link" onClick={this.handleToggleSeeMore}>
            {isCollapsed ? t('global.see_more') : t('global.see_less')}
          </div>
        ) : null}
      </div>
    )
  }
}
