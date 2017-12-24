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
            errorMessage: ''

        };
        this.registerOrLoginWithPurge = this.registerOrLoginWithPurge.bind(this);

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
    screen_edu = (e) => {
        e.preventDefault();
        if (this.state.email.includes(".edu") && this.props.title === "Register") {
            this.setState({
                edu_warning: true
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
                            <ValidatorForm
                                ref={"form"}
                                onSubmit={this.screen_edu}
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
                                        onChange={this.handleChange}
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
                </div>
            )
        } else {
            return null;
        }

    }
}

export default withStyles(styles)(RegisterOrLogin);

