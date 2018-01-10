import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import { FormControl, FormHelperText} from 'material-ui/Form';


class SendReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            error: false,
            errorMessage: false,
            out: false,

        };

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
    }
    sendResetWithErrorHandling = (e) => {
        e.preventDefault();
        this.setState({
            error: false,
            out: true
        });

        this.props.send_reset(this.state.email).then(
            (result) => {
                this.props.setUserState("sentReset");
                this.setState({
                    errorMessage: "",
                    error:false,
                    out: false,
                });
            },
            (error) => {
                this.setState({
                    errorMessage: error.graphQLErrors[0].message,
                    error: true,
                    out: false,
                });
            }
            );
    };
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>Reset Password</h1>
                            <ValidatorForm
                                ref={"form"}
                                onSubmit={this.sendResetWithErrorHandling}
                                instantValidate={false}
                            >
                                <FormControl error={this.state.error} style={{width: "100%"}}>
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
                                    <FormHelperText style={{'display': (this.state.error) ? 'block': 'none'}}>{this.state.errorMessage}</FormHelperText>
                                </FormControl>
                                <br/><br/>
                                <Button raised color={"primary"} type={"submit"}>
                                    {this.state.out ? "Loading..." : "Reset Password"}
                                </Button>
                            </ValidatorForm>
                            <br/><br/>
                            <Button raised color={"accent"} onClick={() => this.props.setUserState("login")}>Back to login</Button>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return null;
        }

    }
}

class SentReset extends Component {
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>Reset Email Sent</h1>
                            Please check your email to reset your password.
                            <br/><br/>
                            <Button raised color={"primary"} onClick={() => this.props.setUserState("sendReset")}>Resend Email</Button>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return null;
        }
    }
}

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            passwordRepeat: '',
        };

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    componentWillMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return this.state.passwordRepeat === this.state.password;
        });
    }
    sendResetWithErrorHandling = (e) => {
        e.preventDefault();
        this.props.reset_password(this.state.password, this.props.token).then(
            (result) => {
                this.props.setUserState("resetPasswordFinished");
            },
            (error) => {
                this.props.setUserState("resetPasswordFailed");
            }
        );
    };
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>Reset your password</h1>
                            <ValidatorForm
                                ref={"form"}
                                onSubmit={this.sendResetWithErrorHandling}
                                instantValidate={false}
                            >
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
                                <br/><br/>
                                <Button raised color={"primary"} type={"submit"}>
                                    Reset Password
                                </Button>
                            </ValidatorForm>
                            <br/><br/>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return null;
        }

    }
}

class ResetPasswordFinished extends Component {
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>Password Reset Complete</h1>
                            Your password was successfully reset.
                            <br/><br/>
                            <Button raised color={"primary"}
                                    onClick={() => {window.location.href= "https://apply.menlohacks.com"}}>
                                Return to login
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return null;
        }
    }
}

class ResetPasswordFailed extends Component {
    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={3} sm={10} xs={10}>
                            <h1>Password Reset Failed</h1>
                            Your password was not successfully reset. Your reset token may have expired, or you may
                            have already used it.
                            <br/><br/>
                            <Button raised color={"primary"} onClick={() => this.props.setUserState("sendReset")}>Resend password reset email</Button>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return null;
        }
    }
}

export {SendReset, SentReset, PasswordReset, ResetPasswordFinished, ResetPasswordFailed};

