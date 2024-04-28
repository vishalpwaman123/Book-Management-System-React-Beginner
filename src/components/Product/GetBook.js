import React, { useState, useEffect } from "react";
import "./GetBook.css";
import BookServices from "../../services/BookServices";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";

const bookServices = new BookServices();

export default function GetBook(props) {
  const [Message, setMessage] = useState("");
  const [OpenSnackBar, setOpenSnackBar] = useState(false);
  const [OpenLoader, setOpenLoader] = useState(false);

  useEffect(() => {
    console.log("Get Book Calling...");
  }, []);

  const EditBook = async (Data) => {
    console.log("Edit Book Data : ", Data);
    props.EditBook(Data);
  };

  const DeleteBook = async (BookID, PublicID) => {
    debugger
    setOpenLoader(true);
    let data = {
      bookID: BookID,
      publicID: PublicID,
    };
    bookServices
      .DeleteBook(data)
      .then((data) => {
        // debugger;
        console.log("DeleteBook Data : ", data);
        setOpenLoader(false);
        setOpenSnackBar(true);
        setMessage(data.data.message);
        props.GetBook(props.PageNumber);
      })
      .catch((error) => {
        console.log("DeleteBook Error : ", error);
        setOpenLoader(false);
        setOpenSnackBar(true);
        setMessage("Something Went Wrong");
        props.GetBook(props.PageNumber);
      });
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  return (
    <div className="GetBook-Container">
      <div className="GetBook-SubContainer">
        {Array.isArray(props.List) && props.List.length > 0
          ? props.List.map(function (data, index) {
              // console.log("Data : ", data);
              return (
                <Card
                  className=""
                  style={{ maxWidth: 350, margin: 15 }}
                  key={index}
                >
                  <CardActionArea>
                    <CardMedia
                      //   className=""
                      style={{ height: 180, width: 260 }}
                      image={data.bookImageUrl}
                      title="Contemplative Reptile"
                    />

                    <CardContent
                      style={{
                        width: 228,
                        height: 130,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        // style={{ margin: 0 }}
                      >
                        {data.bookName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{
                          height: 80,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          // display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                        }}
                      >
                        {data.bookDetails}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: 600,
                          color: "blue",
                        }}
                      >
                        {data.quantity !== 0 ? (
                          <>Available : {data.quantity}</>
                        ) : (
                          <>Not Available</>
                        )}
                        &nbsp; &nbsp;{" "}
                        {props.State !== "MyOrder" ? (
                          <>Price : {data.bookPrice} &#8377;</>
                        ) : null}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    {props.State === "Home" ? (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            EditBook(data);
                          }}
                        >
                          <EditIcon style={{ color: "black" }} />
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            DeleteBook(data.bookID, data.publicId);
                          }}
                        >
                          <DeleteIcon style={{ color: "black" }} />
                        </Button>
                      </>
                    ) : null}
                  </CardActions>
                </Card>
              );
            })
          : null}
      </div>
      {/* <Pagination
        count={props.TotalPages}
        Page={props.PageNumber}
        onChange={props.handlePaging}
        variant="outlined"
        shape="rounded"
        color="secondary"
      /> */}
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
