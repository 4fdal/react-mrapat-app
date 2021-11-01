import React from 'react';

export default class AbsentScreen extends React.Component {
  handleNavigationOptions = () => {
    this.props.navigation.setOptions({
      title: 'Pengambilan Absensi',
    });
  };
  componentDidMount = () => {
    this.handleNavigationOptions();
  };
  render = () => {
    return <></>;
  };
}
