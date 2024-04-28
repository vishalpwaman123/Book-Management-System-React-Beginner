import AxiosServices from "./AxiosServices";
import BookConfiguration from "../configurations/BookConfiguration";

const axiosServices = new AxiosServices();

export default class BookServices {
  InsertBook(data) {
    return axiosServices.post(BookConfiguration.InsertBook, data, false);
  }
  GetBook(data) {
    return axiosServices.Get(
      BookConfiguration.GetBook +
        "?pageNumber=" +
        data.pageNumber +
        "&numberOfRecordsPerPage=" +
        data.numberOfRecordPerPage,
      false
    );
  }
  GetBookByID(data) {
    return axiosServices.post(BookConfiguration.GetBookByID, data, false);
  }

  UpdateBook(data) {
    return axiosServices.Put(BookConfiguration.UpdateBook, data, false);
  }

  DeleteBook(data) {
    return axiosServices.Delete(BookConfiguration.DeleteBook, data, false);
  }
}
