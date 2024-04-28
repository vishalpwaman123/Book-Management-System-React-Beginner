import React, { useState, useEffect } from "react";
import "./AddBook.css";
import BookServices from "../../services/BookServices";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DefaultImage from "../Asserts/img.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const bookServices = new BookServices();

export default function AddBook(props) {
  const [Message, setMessage] = useState("");
  const [OpenLoader, setOpenLoader] = useState(false);
  const [OpenSnackBar, setOpenSnackBar] = useState(false);
  const [Image, setImage] = useState(DefaultImage);
  const [Data, setData] = useState({
    Image: new FormData(),
    PublicID: "",
    BookID: 0,
    BookName: "",
    BookDescription: "",
    BookType: "",
    BookAuther: "",
    BookPrice: "",
    Quantity: "",
  });

  const [UpdateImage, setUpdateImage] = useState(false);
  const [Update, setUpdateFlag] = useState(false);
  const [ImageFlag, setImageFlag] = useState(false);
  const [BookName, setBookName] = useState(false);
  const [BookType, setBookType] = useState(false);
  const [BookPrice, setBookPrice] = useState(false);
  const [Quantity, setQuantity] = useState(false);

  useEffect(() => {
    console.log("Use Effect Data : ", props.Data);
    if (props.Data !== null) {
      setUpdateFlag(true);
      setImage(props.Data.bookImageUrl);
      setData({
        ...Data,
        Image: props.Data.bookImageUrl,
        PublicID: props.Data.publicId,
        BookID: Number(props.Data.bookID),
        BookName: props.Data.bookName,
        BookDescription: props.Data.bookDetails,
        BookAuther: props.Data.bookAuthor,
        BookType: props.Data.bookType,
        BookPrice: props.Data.bookPrice,
        Quantity: Number(props.Data.quantity),
      });
    } else {
      setUpdateFlag(false);
    }
  }, []);

  const handleCapture = (event) => {
    setUpdateImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    setData({ ...Data, Image: event.target.files[0] });
  };

  const CheckValidity = async () => {
    console.log("Check Validity Calling....");
    setImageFlag(false);
    setBookName(false);
    setBookType(false);
    setBookPrice(false);
    setQuantity(false);
    if (Data.BookName === "") {
      console.log("Book Name Empty");
      setBookName(true);
    }

    if (Data.BookType === "") {
      console.log("Book Type Empty");
      setBookType(true);
    }

    if (Data.BookPrice === "") {
      console.log("Book Price Empty");
      setBookPrice(true);
    }

    if (Number(Data.Quantity) <= 0) {
      console.log("Quantity Empty");
      setQuantity(true);
    }

    if (Image === DefaultImage) {
      console.log("Image Empty");
      setImageFlag(true);
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  const handleAddBook = async () => {
    await CheckValidity();
    if (Image === DefaultImage) {
      console.log("Please enter Book Image");
      return;
    }
    if (
      BookName === false &&
      BookType === false &&
      BookPrice === false &&
      Quantity === false
    ) {
      setOpenLoader(true);
      const data1 = new FormData();
      data1.append("bookName", Data.BookName);
      data1.append("bookType", Data.BookType);
      data1.append("bookPrice", Data.BookPrice);
      data1.append("bookDetails", Data.BookDescription);
      data1.append("bookAuthor", Data.BookAuther);
      data1.append("quantity", Data.Quantity);

      if (!Update) {
        data1.append("file", Data.Image);
        bookServices
          .InsertBook(data1)
          .then((data) => {
            console.log(" InsertBook Data : ", data);
            setOpenLoader(false);
            setOpenSnackBar(true);
            setMessage(data.data.message);
            props.handleOpenHomeNav();
          })
          .catch((error) => {
            console.log("InsertBook Error : ", error);
            setOpenLoader(false);
            setOpenSnackBar(true);
            setMessage("Something Went Wrong");
          });
      } else {
        if (UpdateImage) {
          //Enter New Image
          data1.append("file2", Data.Image);
        } else {
          //Old Image
          data1.append("file1", Data.Image);
        }
        data1.append("updateImage", UpdateImage);
        data1.append("bookID", Data.BookID);
        data1.append("publicID", Data.PublicID);
        bookServices
          .UpdateBook(data1)
          .then((data) => {
            console.log(" UpdateBook Data : ", data);
            setOpenLoader(false);
            setOpenSnackBar(true);
            setMessage(data.data.message);
            props.handleOpenHomeNav();
          })
          .catch((error) => {
            console.log("UpdateBook Error : ", error);
            setOpenLoader(false);
            setOpenSnackBar(true);
            setMessage("Something Went Wrong");
          });
      }
      console.log("Acceptable : Data ", data);
    } else {
      console.log("Please Fill Required Field. Data : ", Data);
    }
  };

  return (
    <div className="AddBook-Container">
      <div className="AddBook-SubContainer">
        <div
          className="AddBook-Box1"
          style={
            ImageFlag
              ? { border: "0.5px solid red" }
              : { border: "0.5px solid lightgray" }
          }
        >
          <div className="ImageField">
            <img
              src={Image}
              alt="Book-Image"
              style={{ height: "90%", width: "90%" }}
            />
          </div>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleCapture}
          />
          <label
            htmlFor="contained-button-file"
            style={{ margin: "10px 0 0 0" }}
          >
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </div>
        <div
          className="AddBook-Box2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            size="small"
            label="Book Name"
            variant="outlined"
            placeholder="Ex. Mobile, Book"
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            error={BookName}
            value={Data.BookName}
            onChange={(e) => {
              setData({ ...Data, BookName: e.target.value });
            }}
          />
          <TextField
            multiline
            rows={5}
            size="small"
            label="Book Description"
            variant="outlined"
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            value={Data.BookDescription}
            onChange={(e) => {
              setData({ ...Data, BookDescription: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Book Type"
            variant="outlined"
            placeholder="Ex. Knowledge, Story"
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            error={BookType}
            value={Data.BookType}
            onChange={(e) => {
              setData({ ...Data, BookType: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Book Price"
            variant="outlined"
            placeholder="Ex. 1000 "
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            error={BookPrice}
            value={Data.BookPrice}
            onChange={(e) => {
              setData({ ...Data, BookPrice: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Book Auther"
            variant="outlined"
            placeholder="Ex. Sony, Tata"
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            value={Data.BookAuther}
            onChange={(e) => {
              setData({ ...Data, BookAuther: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Quantity"
            variant="outlined"
            type="number"
            placeholder="Ex. 12"
            style={{ margin: "10px 0 10px 30px", width: "80%" }}
            error={Quantity}
            value={Data.Quantity}
            onChange={(e) => {
              setData({ ...Data, Quantity: e.target.value });
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "10px 0 0px 30px", width: "80%" }}
            onClick={() => {
              handleAddBook();
            }}
          >
            {Update ? <>Update</> : <>Add</>} Book
          </Button>
        </div>
      </div>
      <Backdrop style={{ zIndex: "1", color: "#fff" }} open={OpenLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={OpenSnackBar}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message={Message}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={handleSnackBarClose}
            >
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackBarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
