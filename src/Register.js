import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import { FormControl, FormHelperText} from 'material-ui/Form';
import SweetAlert from 'sweetalert2-react';



const styles = theme => ({

});

class RegisterOrLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordRepeat: '',
            error: false,
            passwordIncorrect: false,
            userDoesNotExist: false,
            userAlreadyExists: false,
            edu_warning: false,
            non_menlo_warning: false,
            errorMessage: ''

        };
        this.registerOrLoginWithPurge = this.registerOrLoginWithPurge.bind(this);

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleEmailChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value.toLowerCase()
        });
    };
    componentWillMount() {
        ValidatorForm.addValidationRule('isValidEmail', (value) => {
            return Boolean(value.match(this.props.CONSTANTS.loading ? ".*" : this.props.CONSTANTS.CONSTANTS.EMAIL_REGEX));
        });
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return this.state.passwordRepeat === this.state.password;
        });
    }
    screen_edu_and_non_menlo = (e) => {
        e.preventDefault();
        if (this.state.email.includes(".edu") && this.props.title === "Register") {
            this.setState({
                edu_warning: true
            });
        } else {
            this.screen_non_menlo(e);
        }
    };
    screen_non_menlo = (e) => {
        e.preventDefault();
        if (this.props.title === "Register" && !this.state.email.includes("@menloschool.org") &&
                !this.props.CONSTANTS.loading &&
                new Date() > new Date(parseInt(this.props.CONSTANTS.CONSTANTS.APPLICATIONS_CLOSE, 10))) {
            this.setState({
                non_menlo_warning: true
            });
        } else {
            this.registerOrLoginWithPurge();
        }
    };
    registerOrLoginWithPurge() {

        this.setState({
            userDoesNotExist: false,
            userAlreadyExists: false,
            passwordIncorrect: false,
            edu_warning: false,
            non_menlo_warning: false,
        });

        this.props.registerOrLogin(this.state.email, this.state.password, (error) => {
            let message = error.graphQLErrors[0].message;
            this.setState({
                errorMessage: message,
            });

            if (message.includes("does not exist in our database.")) {
                this.setState({
                    userDoesNotExist: true
                });
                this.setState({
                    email: '',
                });
            } else if (message === "Your password is incorrect. Try again.") {
                this.setState({
                    passwordIncorrect: true
                });
                this.setState({
                    password: '',
                });
            } else if (message.includes("already has an account.")) {
                this.setState({
                    userAlreadyExists: true
                });
                this.setState({
                    email: '',
                });
            }
        }, () => {
            this.setState({
                password: '',
                passwordRepeat: ''
            });
        });
    };
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>{this.props.title}</h1>
                            {
                                this.props.title === "Register" && !this.props.CONSTANTS.loading &&
                                new Date() > new Date(parseInt(this.props.CONSTANTS.CONSTANTS.APPLICATIONS_CLOSE,
                                    10)) ?
                                    <p>Registration for students who do not go to Menlo has closed.</p>
                                    :
                                    null
                            }
                            <p>
                                {this.props.title === 'Log in' ? "You will need to create an account, even if you had one last year.":
                                    null
                                }
                            </p>
                            <ValidatorForm
                                ref={"form"}
                                onSubmit={this.screen_edu_and_non_menlo}
                                instantValidate={false}
                            >
                                <FormControl error={this.state.userAlreadyExists || this.state.userDoesNotExist} style={{width: "100%"}}>
                                    <TextValidator
                                        label={"email"}
                                        margin={"normal"}
                                        value={this.state.email}
                                        name={"email"}
                                        validators={['required', 'isValidEmail']}
                                        errorMessages={['Please enter your email.', 'Please enter a valid email.']}
                                        onChange={this.handleEmailChange}
                                        fullWidth
                                    />
                                    <FormHelperText style={{'display': (this.state.userAlreadyExists || this.state.userDoesNotExist) ? 'block': 'none'}}>{this.state.errorMessage}</FormHelperText>
                                </FormControl>
                                <FormControl error={this.state.passwordIncorrect} style={{width: "100%"}}>
                                    <TextValidator
                                        label={"password"}
                                        margin={"normal"}
                                        value={this.state.password}
                                        type={"password"}
                                        name={"password"}
                                        onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={['Please enter a password.']}
                                        fullWidth
                                    />
                                    <FormHelperText style={{'display': this.state.passwordIncorrect ? 'block': 'none'}}>{this.state.errorMessage}</FormHelperText>
                                </FormControl>
                                
                                {this.props.title === 'Log in' ? null:
                                    <TextValidator
                                        label={"confirm password"}
                                        margin={"normal"}
                                        type={"password"}
                                        name={"passwordRepeat"}
                                        value={this.state.passwordRepeat}
                                        onChange={this.handleChange}
                                        validators={['required', 'isPasswordMatch']}
                                        errorMessages={['Please confirm your password.',
                                            'Passwords do not match.']}
                                        fullWidth
                                    />
                                }
                                <br/><br/>
                                <Button raised color={"primary"} type={"submit"}>
                                    {this.props.title}
                                </Button>
                            </ValidatorForm>
                            <br/><br/>
                            {this.props.title === 'Log in' ?
                                <div><span>
                                    Forgot your password?
                                    <Button onClick={() => this.props.setUserState("sendReset")}>Reset it</Button>
                                </span><br/></div> :
                                null
                            }
                            {this.props.toggleBetween}
                        </Grid>
                    </Grid>
                    <SweetAlert
                        show={this.state.edu_warning}
                        title={"MenloHacks is a High School Event"}
                        text={"We noticed you are using a .edu email address. Only high school students can attend " +
                        "MenloHacks. Are you sure you want to continue?"}
                        showCancelButton
                        onConfirm={this.registerOrLoginWithPurge}
                    />
                    <SweetAlert
                        show={this.state.non_menlo_warning}
                        title={"Applications are closed for non-Menlo students."}
                        text={"You must have a menloschool.org email address to make a new account."}
                        showCancelButton
                        onConfirm={this.registerOrLoginWithPurge}
                    />
                </div>
            )
        } else {
            return null;
        }

    }
}

export default withStyles(styles)(RegisterOrLogin);

