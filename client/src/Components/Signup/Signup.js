import { Component } from "react";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      email: "",
      password: "",
      authFlag: false,
    };
    this.fullnameChangeHandler = this.fullnameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }

  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }

  fullnameChangeHandler = (e) => {
    this.setState({
      fullname: e.target.value,
    });
  };

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  submitSignup(e) {
    //let headers = new Headers();
    e.preventDefault();
    const data = {
      fullname: this.state.fullname,
      email: this.state.email,
      passowrd: this.state.password,
    };

    console.log(data);

    axios.defaults.withCredentials = true;
    if (this.verifyEmailAddressFormat(data.email)) {
      axios
        .post("http://localhost:4000/signup", data)
        .then((response) => {
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Email format wrong!");
    }
  }

  verifyEmailAddressFormat(email) {
    if (email.includes("@") && email.includes(".com")) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div class="container">
        <div class="login_links">
          <h3>Introduce yourself</h3>
          <span class="align-right">
            <div class="login_links">
              <a class="login" href="/login">
                Log in
              </a>

              <a class="signup" href="/signup">
                Sign up
              </a>
            </div>
          </span>
        </div>

        <div class="login-form">
          <div class="main-div">
            <label>Name</label>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                name="fullname"
                onChange={this.fullnameChangeHandler}
                pattern="[A-Za-z\s]{1,32}"
                autoFocus
                required
              />
            </div>
            <label>Email</label>
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                name="email"
                onChange={this.emailChangeHandler}
                required
              />
            </div>
            <label>Passowrd</label>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                name="password"
                onChange={this.passwordChangeHandler}
                required
              />
            </div>
            <button onClick={this.submitSignup}>Sign me up!</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
