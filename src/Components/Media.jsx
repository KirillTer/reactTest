import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

import axios from './../appAxios';
import { SET_MEDIA, LOGOUT } from './../Redux/actions';

class Media extends React.Component {
  render() {
    this.axios = axios;
    const { token } = this.props.Session;
    const { initialRequestSend } = this.props.Media;
    if (!initialRequestSend) {
      this.axios.get('ai/recording/list/', {
        headers: { Authorization: `JWT ${token}` },
      }).then((response) => {
        const { responseText } = response.request;
        const { setMedia } = this.props.SessionActions;
        const { results } = JSON.parse(responseText);
        setMedia({ mediaArray: results });
      });
    }

    const { mediaArray } = this.props.Media;
    const MediaList = mediaArray.map((v, i) => {
      const ratingDOM = [];
      for (let j = 0; j < 5; j += 1) {
        if (j < v.rating) {
          ratingDOM.push(<div className="active-star" key={`${i}:${j}`}>★</div>);
        } else {
          ratingDOM.push(<div className="inactive-star" key={`${i}:${j}`}>★</div>);
        }
      }
      return (
        <tr key={i}>
          <td> {v.final_script} </td>
          <td> {ratingDOM} </td>
          <td> {humanizeDuration(v.duration * 1000)} </td>
          <td> <a href={v.url}>Link</a> </td>
          <td> {moment(v.mediaArray).format('MMMM Do YYYY, hh:mm:ss')} </td>
        </tr>);
    });
    return (
      <div>
        <button onClick={this.props.SessionActions.logout}>LogOut</button>
        <table>
          <tbody>
            {MediaList}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  Session: state.Session,
  Media: state.Media,
});

const mapDispatchToProps = dispatch => ({
  SessionActions: {
    logout: () => { dispatch({ type: LOGOUT }); },
    setMedia: ({ mediaArray }) => {
      dispatch({ type: SET_MEDIA, mediaArray });
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Media);
