import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import SweetAlert from 'sweetalert2-react';
import {FlexBoxOKNewLine} from "./MiscForms";
import filestack from 'filestack-js';
const apikey = 'AKOHZFGyDQgekYH95idduz';
const client = filestack.init(apikey);


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});


class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'cool_project': '',
            'last_summer': '',
            'anything_else': '',
            'liability_form': '',
            'photo_form': '',
            'showAlert': false,
            'errorText': '',
            'delta': {'token': this.props.token},
            'out': false,
            'submitted': false,
        };
        this.initialize_state();
    };

    initialize_state = () => {
        if (this.props.Application.loading) {
            this.timeout = setTimeout(() => {this.initialize_state();}, 50);
            return;
        }
        let application = this.props.Application.application;
        if (application) {
            this.setState({
                'cool_project': application.cool_project ? application.cool_project : '',
                'last_summer': application.last_summer ? application.last_summer : '',
                'anything_else': application.anything_else ? application.anything_else : '',
                'liability_form': application.liability_form ? application.liability_form : '',
                'photo_form': application.photo_form ? application.photo_form : '',
                'submitted': application.submitted
            });
        }
    };
    isEmpty = (value) => {
        return value === '';
    };
    componentWillUnmount () {
        this.timeout && clearInterval(this.timeout);
        this.timeout = false;
    }



    validateAndSubmit = (name, value) => {
        if (name === "cool_project" || name === "last_summer" || name === "liability_form" || name === "photo_form") {
            if (this.isEmpty(value)) {
                return;
            }
        }
        let new_delta = {...{}, ...this.state.delta};
        new_delta[name] = value;
        this.setState({
            delta: new_delta
        }, () => {
            if (!this.state.out) {
                this.spin();
            }
        });

    };

    spin = () => {
        let old_delta = this.state.delta;
        this.setState({
            'delta': {
                'token': this.props.token
            },
            'out': true
        }, () => {
            this.props.updateApplication(old_delta).then((result) => {
                let num_params = Object.getOwnPropertyNames(this.state.delta).length;
                if (num_params > 1) {
                    this.spin();
                } else {
                    this.setState({
                        'out': false
                    });
                }
            }, (error) => {
                console.log("error: " + error);
            });
        });
    };

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
        this.validateAndSubmit(name, value);
    };

    uploadForm = (name) => {
        client.pick({fromSources: ["local_file_system", "dropbox"], maxFiles: 1}).then((res) => {
            if (res.filesUploaded.length > 0) {
                let updated = {};
                let url = res.filesUploaded[0].url;
                updated[name] = url;
                this.setState(updated);
                this.handleChange({target: {name: name, value: url}});
            }
        })
    };

    toPrevPageWait = () => {
        if (!this.state.out) {
            this.props.setUserState("profile");
        } else {
            setTimeout(this.toPrevPageWait, 50);
        }
    };

    render() {
        const { classes } = this.props;
        let is_non_menlo = this.props.userState !== "menlo_application" && this.props.userState !== "bgc_application";
        return (
            <div key={this.props.show} style={{display: this.props.show ? "block" : "none"}}>
                <Grid container spacing={0} justify={"center"}>
                    <Grid item md={10} sm={10} xs={10}>
                        <h1 className={classes.textField}>
                            {
                                is_non_menlo ?
                                    "Application" :
                                    "Forms"
                            }
                        </h1>
                        {
                            this.props.applicationsClosed && is_non_menlo ?
                                <p style={{marginLeft: "8px", marginBottom: "0px"}}>
                                    The application deadline has passed, and you will not be able to edit your application.
                                    You can still upload your forms if you haven't already.
                                </p> :
                                is_non_menlo && !this.props.CONSTANTS.loading ?
                                    <div>
                                        <p style={{marginLeft: "8px", marginBottom: "0px"}}>
                                            Applications will close the midnight
                                            before {new Date(parseInt(this.props.CONSTANTS.CONSTANTS.APPLICATIONS_CLOSE, 10)).toDateString()}.
                                            Please fill out all required information before then.
                                        </p>
                                    </div>
                                    : null
                        }
                        <form
                            ref={"form"}
                            className={classes.container}
                        >
                            {
                                is_non_menlo ?
                                    <div>
                                        <TextField
                                            label={"Describe a cool project you've done in the last six months. *"}
                                            value={this.state.cool_project}
                                            name={"cool_project"}
                                            onChange={this.handleChange}
                                            fullWidth
                                            multiline={true}
                                            className={classes.textField}
                                            margin={"normal"}
                                            disabled={this.props.applicationsClosed}
                                        />
                                        <TextField
                                        label={"What did you do last summer? *"}
                                        value={this.state.last_summer}
                                        name={"last_summer"}
                                        onChange={this.handleChange}
                                        fullWidth
                                        multiline={true}
                                        className={classes.textField}
                                        margin={"normal"}
                                        disabled={this.props.applicationsClosed}
                                        />
                                        <TextField
                                            label={"Is there anything else you want to tell us?"}
                                            value={this.state.anything_else}
                                            name={"anything_else"}
                                            onChange={this.handleChange}
                                            fullWidth
                                            multiline={true}
                                            className={classes.textField}
                                            margin={"normal"}
                                        />
                                    </div> :
                                    null
                            }
                            <FlexBoxOKNewLine/>
                            <span className={classes.textField} style={{marginTop: '8px', marginBottom: '8px'}}>
                                In order to attend MenloHacks, you must upload a signed copy
                                of <a href={!this.props.CONSTANTS.loading ? (this.props.userState === "menlo_application" ? this.props.CONSTANTS.CONSTANTS.MENLO_FORM_URL : this.props.CONSTANTS.CONSTANTS.NON_MENLO_FORM_URL) : ''} target={"_blank"} rel={"noopener"}>our liability waiver</a>. Please upload the signed form as a single file. *
                            </span>
                            <FlexBoxOKNewLine/>
                            <Button raised type={"secondary"}
                                    style={{marginLeft: '8px'}}
                                    onClick={(e) => {e.preventDefault(); this.uploadForm("liability_form")}}>
                                Upload
                            </Button>
                            <FlexBoxOKNewLine/>
                            {
                                this.state.liability_form ?
                                    <span className={classes.textField} style={{marginTop: '8px', marginBottom: '8px'}}>
                                        View your <a target={"_blank"} rel={"noopener"} href={this.state.liability_form}>uploaded liability form.</a>
                                    </span> :
                                    <span className={classes.textField} style={{marginTop: '8px', marginBottom: '8px'}}>
                                        You have not yet uploaded this form.
                                    </span>
                            }
                            <FlexBoxOKNewLine/>
                            <span className={classes.textField} style={{marginTop: '16px', marginBottom: '8px'}}>
                                In order to attend MenloHacks, you must upload a signed copy
                                of <a href={!this.props.CONSTANTS.loading ? this.props.CONSTANTS.CONSTANTS.PHOTO_FORM_URL : ""} target={"_blank"} rel={"noopener"}>our photo release form</a>. Please upload the signed form as a single file. *
                            </span>
                            <FlexBoxOKNewLine/>
                            <Button raised type={"secondary"}
                                    style={{marginLeft: '8px'}}
                                    onClick={(e) => {e.preventDefault(); this.uploadForm("photo_form")}}>
                                Upload
                            </Button>
                            <FlexBoxOKNewLine/>
                            {
                                this.state.photo_form ?
                                    <span className={classes.textField} style={{marginTop: '8px', marginBottom: '8px'}}>
                                        View your <a target={"_blank"} href={this.state.photo_form} rel={"noopener"}>uploaded photo release form.</a>
                                    </span> :
                                    <span className={classes.textField} style={{marginTop: '8px', marginBottom: '8px'}}>
                                        You have not yet uploaded this form.
                                    </span>
                            }
                            <FlexBoxOKNewLine/>
                            {
                                this.state.submitted ?
                                    <p style={{color: "#289b28", marginLeft: "8px", marginBottom: "0px"}}>
                                        Everything has been submitted. {is_non_menlo ?
                                        "You can still edit your application until the deadline." :
                                        "You can still edit your information."}
                                    </p> :
                                    null
                            }
                            <FlexBoxOKNewLine/>
                            <Button raised color={"primary"}
                                    style={{marginLeft: '8px', marginTop: "16px"}}
                                    onClick={this.toPrevPageWait}>
                               Previous
                            </Button>
                            <span style={{marginTop: "26px", "marginLeft": "auto"}}>Autosaved</span>
                            <Button raised color={"primary"}
                                    style={{marginLeft: '16px', marginTop: "16px"}} onClick={
                                        () => this.handleChange({target: {name: "submitted", value: true}})
                            }>
                                Submit
                            </Button>
                        </form>
                        <br/><br/>
                    </Grid>
                    <SweetAlert
                        show={this.state.showAlert}
                        title={"Error"}
                        type={"error"}
                        text={this.state.errorText}
                        onConfirm={() => this.setState({ showAlert: false })}
                    />
                </Grid>
            </div>
        )

    }
}

export default withStyles(styles)(Application);

