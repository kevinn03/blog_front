import React from 'react';

export default function Notification(props) {
  if (props.message === null) {
    return null;
  }
  return <div className="hide note">{props.message}</div>;
}
