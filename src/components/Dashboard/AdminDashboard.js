import React, { Component } from "react";
import "./AdminDashboard.css";
import AddBook from "../Product/AddBook";
import GetBook from "../Product/GetBook";
import BookServices from "../../services/BookServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ViewListIcon from "@material-ui/icons/ViewList";
import BookIcon from "@material-ui/icons/Book";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Pagination from "@material-ui/lab/Pagination";
import FeedbackIcon from "@material-ui/icons/Feedback";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import EditIcon from "@material-ui/icons/Edit";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

//Table Library
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

// const feedbackServices = new FeedbackServices();
const bookServices = new BookServices();
// const authServices = new AuthServices();
// const cartServices = new CartServices();

const MobileRegex = RegExp(/^[0-9]{11}$/i);
const PinCodeRegex = RegExp(/^[0-9]{7}$/i);
const EmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      Book: [],
      //

      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      PageNumber: 1,

      FeedbackPageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      OpenEdit: false, // Open Editing Booking Model
      OpenLoader: false,
      OpenSnackBar: false,

      OpenHome: true,
      OpenAddBook: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenCustomerList: false,
      OpenOrderList: false,
      OpenFeedBack: false,

      Update: false,
      ShowApplicantInfo: false,
      OpenBookModel: false, //Editing Booking Application
    };
  }

  //
  componentWillMount() {
    console.log("Component will mount calling ...  State : ", this.state);
    this.setState({
      OpenHome: localStorage.getItem("OpenHome") === "true" ? true : false,
      OpenAddBook:
        localStorage.getItem("OpenAddBook") === "true" ? true : false,
    });

    if (localStorage.getItem("OpenHome") === "true") {
      this.GetBook(this.state.PageNumber);
    }
  }

  //
  GetBook = async (CurrentPage) => {
    console.log("Get Book Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 4,
    };
    this.setState({ OpenLoader: true });
    bookServices
      .GetBook(data)
      .then((data) => {
        console.log("GetBook Data : ", data);
        // debugger
        if (data.data.data === null && this.state.PageNumber > 1) {
          this.setState({ PageNumber: this.state.PageNumber - 1 });
          this.BookServices(this.state.PageNumber);
        } else {
          this.setState({
            Book: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: data.data.currentPage,
            OpenLoader: false,
          });
        }
      })
      .catch((error) => {
        console.log("GetBook Error : ", error);
        this.setState({ OpenLoader: false });
      });
  };

  EditBook = async (Data) => {
    this.handleOpenAddBookNav(Data);
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  //
  handleOpenHomeNav = () => {
    console.log("Handle Open List Calling ... ");
    //
    localStorage.setItem("OpenHome", true);
    localStorage.setItem("OpenAddBook", false);
    //
    this.setState({
      PageNumber: 1,
      OpenHome: true,
      OpenAddBook: false,
    });
    //
    this.GetBook(this.state.PageNumber == 0 ? 1 : this.state.PageNumber);
  };

  //
  handleOpenAddBookNav = (Data) => {
    console.log("Handle Add Book Nav Calling ... ");
    //
    localStorage.setItem("OpenHome", false);
    localStorage.setItem("OpenAddBook", true);
    //
    this.setState({
      Data: Data,
      PageNumber: 1,
      OpenHome: false,
      OpenAddBook: true,
    });
  };

  handlePaging = async (e, value) => {
    let state = this.state;
    console.log("Current Page : ", value);

    this.setState({
      PageNumber: value,
    });

    // if (state.OpenHome) {
    //   await this.BookServices(value);
    // } else if (state.OpenArchive) {
    //   this.GetArchiveList(value);
    // } else if (state.OpenTrash) {
    //   this.GetTrashList(value);
    // } else if (state.OpenCustomerList) {
    //   this.GetCustomerList(value);
    // } else if (state.OpenOrderList) {
    //   this.GetAllOrderList(value);
    // } else if (state.OpenFeedBack) {
    //   this.GetFeedBack(value);
    // }
  };

  SignOut = async () => {
    await localStorage.removeItem("OpenHome");
    await localStorage.removeItem("OpenAddBook");

    this.props.history.push("/SignIn");
  };

  //
  OpenHomeNav = () => {
    return (
      <GetBook
        List={this.state.Book}
        State="Home"
        TotalPages={this.state.TotalPages}
        PageNumber={this.state.PageNumber}
        handlePaging={this.handlePaging}
        GetBook={this.GetBook}
        EditBook={this.EditBook}
      />
    );
  };

  //
  OpenAddBookNav = () => {
    return (
      <AddBook
        Data={this.state.Data}
        handleOpenHomeNav={() => {
          this.handleOpenHomeNav();
        }}
      />
    );
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    return (
      <div className="AdminDashboard-Container">
        <div className="Sub-Container">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "#202020" }}>
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 3,
                    display: "flex",
                    padding: "5px 0 0 200px",
                    boxSizing: "border-box",
                  }}
                >
                  Book Management System &nbsp;
                  <div style={{ margin: "3px 0 0 0" }}>
                    <LocalLibraryIcon />
                  </div>
                </Typography>
                <div className="search" style={{ flexGrow: 0.5 }}>
                  <div className="searchIcon">
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Product"
                    classes={{
                      root: "inputRoot",
                      input: "inputInput",
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>

                {/* <IconButton onClick={this.handleSetting}>
                  <SettingsIcon style={{ color: "white" }} />
                </IconButton> */}
                <Button
                  color="inherit"
                  onClick={() => {
                    this.SignOut();
                  }}
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className="SubBody11">
                <div
                  className={state.OpenHome ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenHomeNav}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <HomeIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Home</div>
                </div>

                <div
                  className={state.OpenAddBook ? "NavButton1" : "NavButton2"}
                  onClick={() => {
                    this.handleOpenAddBookNav(null);
                  }}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <AddBoxIcon style={{ color: "white" }} />
                  </IconButton>
                  <div className="NavButtonText">Add Book</div>
                </div>
              </div>
              <div className="SubBody21">
                <div style={{ height: "100%", width: "100%" }}>
                  {state.OpenHome ? (
                    this.OpenHomeNav()
                  ) : state.OpenAddBook ? (
                    this.OpenAddBookNav()
                  ) : (
                    <></>
                  )}

                  
                </div>
              </div>
            </div>
          </div>
          {/* <Pagination
        count={props.TotalPages}
        Page={props.PageNumber}
        onChange={props.handlePaging}
        variant="outlined"
        shape="rounded"
        color="secondary"
      /> */}
          <Backdrop
            style={{ zIndex: "1", color: "#fff" }}
            open={this.state.OpenLoader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={state.OpenSnackBar}
            autoHideDuration={2000}
            onClose={this.handleSnackBarClose}
            message={state.Message}
            action={
              <React.Fragment>
                <Button
                  color="secondary"
                  size="small"
                  onClick={this.handleSnackBarClose}
                >
                  UNDO
                </Button>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleSnackBarClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </div>
      </div>
    );
  }
}
