import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UploadFile {
  id:string,
  file: File;
  preview: string;
  title: string;
  description: string;
  tags: string[];
  license: string;
  category: string;
  imageType?: string;
  aiGeneratedStatus?: string;
}

interface UploadState {
  files: UploadFile[];
  isUploading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: UploadState = {
  files: [],
  isUploading: false,
  error: null,
  success: null,
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<UploadFile>) => {
      state.files.push(action.payload);
    },
    updateFile: (state, action: PayloadAction<{ index: number, data: Partial<UploadFile> }>) => {
      const { index, data } = action.payload;
      if (index >= 0 && index < state.files.length) {
        state.files[index] = { ...state.files[index], ...data };
      }
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.files = state.files.filter((_, index) => index !== action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    resetUploadState: () => initialState,
  },
});

export const { 
  addFile, 
  updateFile, 
  removeFile, 
  clearFiles, 
  setUploading, 
  setError, 
  setSuccess,
  resetUploadState
} = uploadSlice.actions;

export default uploadSlice.reducer; 