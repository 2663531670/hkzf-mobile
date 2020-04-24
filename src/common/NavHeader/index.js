import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
class NavHeader extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired
  }
  render() {
    return (
      <div className="NavHeader">
        <NavBar
          mode="Dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          {this.props.children}
        </NavBar>
      </div>
    )
  }
}
export default withRouter(NavHeader)
