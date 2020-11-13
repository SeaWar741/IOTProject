export const initialState = {
  /* request: `/trending/all/week?api_key=${API_KEY}&language=en-US`, */
  /* title: "Trending now", */
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