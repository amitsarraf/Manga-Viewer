import axios from "axios";
import * as url from "./apiUrl";

// Create an instance of Axios
const axiosInstance = axios.create();

export const getBook = async () => {
  try {
    const response = await axiosInstance.get(url.GET_BOOKS);
    if (response.status >= 200 || response.status <= 299) return response;

    throw response;
  } catch (error: any) {
    return error.response;
  }
};

export const getBookById = async (bookId: number) => {
  try {
    const response = await axiosInstance.get(`${url.GET_BOOK_BY_ID}${bookId}/`);
    if (response.status >= 200 || response.status <= 299) return response;

    throw response;
  } catch (error: any) {
    return error.response;
  }
};

export const getChaptersDetail = async (chapterId: number) => {
  try {
    const response = await axiosInstance.get(
      `${url.GET_CHAPTERS_BY_ID}${chapterId}/`
    );
    if (response.status >= 200 || response.status <= 299) return response;

    throw response;
  } catch (error: any) {
    return error.response;
  }
};
