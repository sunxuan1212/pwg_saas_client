import React from 'react';

const Layout_01 = (props) => {

  return (
    <React.Fragment>
      <div className="layout_01-header">
        {props.header ? props.header : null}
      </div>
      <div className="layout_01-content">
        {props.children ? props.children : null}
      </div>
      <div className="layout_01-footer">
        {props.footer ? props.footer : null}
      </div>
    </React.Fragment>
  );
}

export default Layout_01;