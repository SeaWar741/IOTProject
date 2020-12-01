export const initialState = {
  ID: "1"
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ID":
      return {
        ...state,
        ID: action.ID
      };
    default:
      return state;
  }
};

export default reducer;