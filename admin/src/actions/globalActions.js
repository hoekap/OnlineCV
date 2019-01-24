import axios from "axios";

import { GET_PROJECT_DATA, GET_ADMIN_DATA } from "./types";

export const getStartData = () => dispatch => {
  axios.get("/api/admins/startdata", {withCredentials: true}).then(
    res => {
      dispatch({type: GET_PROJECT_DATA, payload: res.data.projects});
      dispatch({type: GET_ADMIN_DATA, payload: res.data.user});
    }
  ).catch(
    err => {
      // TODO
    }
  );
  axios.get("/api/csrftoken").then(
    res => {
      const { csrftoken } = res.data;
      axios.defaults.headers.common["csrf-token"] = csrftoken;
    }
  );
};
