import { createSlice } from "@reduxjs/toolkit";

const profileEditSlice = createSlice({
  name: "profileEdit",
  initialState: { image: null },
  reducers: {
    setImage: (state, action) => {},
    setPreview: (state, action) => {},
  },
});

export const { setImage, setPreview } = profileEditSlice.actions;
export default profileEditSlice.reducer;
