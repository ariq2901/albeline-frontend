import { combineReducers } from "redux";

const initialQ = {
  open: false,
  id: 0,
};

const QReducer = (state = initialQ, action) => {
  switch (action.type) {
    case "SET_QUICKVIEW":
      return {
        ...state,
        open: action.open,
        id: action.id,
      };

    case "SET_POPUP":
      return {
        ...state,
        open: action.open,
      };

    default:
      return state;
  }
};

const initialCredentialPopup = {
  open: false,
  popup: "login",
};

const CredentialPopup = (state = initialCredentialPopup, action) => {
  switch (action.type) {
    case "CREDENTIAL_POPUP":
      return {
        ...state,
        open: action.open,
      };
    case "POPUP_TYPE":
      return {
        ...state,
        popup: action.popup,
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  QReducer,
  CredentialPopup,
});

export default reducer;
