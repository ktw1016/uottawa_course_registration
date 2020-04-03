import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './Details.scss';

export class Details extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: props.initialOpen || false,
    };
  }
  render(){
    const {
      summary_content,
      content,
      persist_content,
      is_conflict,
      section_registered,
    } = this.props;
    const { isOpen } = this.state;

    const aria_labels = {
      open: "Content follows, activate to collapse content",
      closed: "Activate to expand content",
    };

    const label_id = _.uniqueId("IBDetails__a11yLabel");

    return <div className="IBDetails text-center"> 
      <button
        className={classNames("IBDetails__Summary", isOpen && "IBDetails__Summary--open")}
        onClick={()=> this.setState({isOpen: !isOpen})}
        aria-labelledby={label_id}
      >
        <div className="text-center">
          <span aria-hidden className="IBDetails__TogglerIcon">
            { isOpen ? "▼" : "►" }
          </span>
          <span id={label_id}>
            { summary_content }
            <span className="sr-only">
              {aria_labels[isOpen ? "open" : "closed"]}
            </span>
          </span>
          { section_registered &&
            <span
              style={{fontSize: 10, color: "green", marginLeft: 20}}
              dangerouslySetInnerHTML={{
              __html: `(Currently registered)`
            }} />
          }
          { is_conflict &&
            <span
              style={{fontSize: 10, color: "red", marginLeft: 20}}
              dangerouslySetInnerHTML={{
              __html: `(Possible conflict with other class)`
            }} />
          }
        </div>
      </button>
      <div className={classNames("IBDetails__content", `IBDetails__content--${isOpen ? "open" : "closed"}`)}>
        { (isOpen || persist_content) && content }
      </div>
    </div>;
  }

}