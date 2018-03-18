import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import {MenuItem}  from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css'
import IntegrationAutosuggest from './IntegrationAutosuggest';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText, FormControlLabel } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';
import {FlexBoxOKNewLine, TextWithValidation} from "./MiscForms";



const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});




class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'first_name': '',
            'last_name': '',
            'school': '',
            'grade': '',
            'phone_number': '',
            'gender': '',
            'dietary_restrictions': '',
            'shirt_size': '',
            'github_link': '',
            'linkedin_profile': '',
            'devpost_profile': '',
            'personal_website': '',
            'is_bgc': false,
            'mlh_agreement': false,
            'showAlert': false,
            'errorText': '',
            'first_name_error': false,
            'last_name_error': false,
            'gender_error': false,
            'grade_error': false,
            'grade_error_message': '',
            'school_error': false,
            'dietary_restrictions_error': false,
            'shirt_size_error': false,
            'mlh_error': false,
            'delta': {'token': this.props.token},
            'out': false
        };
        this.initialize_state();
    }

    initialize_state = () => {
        if (this.props.Profile.loading) {
            this.timeout = setTimeout(() => {this.initialize_state();}, 5);
            return;
        }
        let profile = this.props.Profile.profile;
        this.setState({
            'first_name': profile.first_name ? profile.first_name : '',
            'last_name': profile.last_name ? profile.last_name : '',
            'school': profile.school ? profile.school : '',
            'grade': profile.grade ? profile.grade : '',
            'phone_number': profile.phone_number ? profile.phone_number : '',
            'gender': profile.gender ? profile.gender : '',
            'dietary_restrictions': profile.dietary_restrictions ? profile.dietary_restrictions : '',
            'shirt_size': profile.shirt_size ? profile.shirt_size : '',
            'github_link': profile.github_link ? profile.github_link : '',
            'linkedin_profile': profile.linkedin_profile ? profile.linkedin_profile : '',
            'devpost_profile': profile.devpost_profile ? profile.devpost_profile : '',
            'personal_website': profile.personal_website ? profile.personal_website : '',
            'is_bgc': !!profile.is_bgc,
            'mlh_agreement': !!profile.mlh_agreement,
        });
    };
    componentWillUnmount () {
        this.timeout && clearInterval(this.timeout);
        this.timeout = false;
    }


    isEmpty = (value) => {
        return value === '';
    };

    isGradeError = (value) => {
        if (this.isEmpty(value)) {
            this.setState({
                'grade_error_message': 'Please enter your grade.'
            });
            return true;
        } else {
            let int_value = parseInt(value, 10);
            if (int_value) {
                if (int_value > (this.props.CONSTANTS.loading ? 12 : this.props.CONSTANTS.CONSTANTS.MAX_GRADE)) {
                    this.setState({
                        'grade_error_message': 'Only high school students can attend MenloHacks.'
                    });
                    return true;
                } else {
                    return false;
                }
            } else {
                this.setState({
                    'grade_error_message': 'Please enter your grade as a number.'
                });
                return true;
            }
        }
    };

    isPhoneNumberError = (value) => {
        if (this.isEmpty(value)) {
            this.setState({
                'phone_number_error_message': 'Please enter your phone number.'
            });
            return true;
        } else {
            if (!value.match(this.props.CONSTANTS.loading ? ".*" : this.props.CONSTANTS.CONSTANTS.PHONE_REGEX)) {
                this.setState({
                    'phone_number_error_message': 'Please enter a valid phone number.'
                });
                return true;
            } else {
                return false;
            }
        }
    };

    validateAndSubmit = (name, value) => {
        if (name === "first_name") {
            let error = this.isEmpty(value);
            this.setState({
                'first_name_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "last_name") {
            let error = this.isEmpty(value);
            this.setState({
                'last_name_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "school") {
            let error = this.isEmpty(value);
            this.setState({
                'school_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "grade") {
            let error = this.isGradeError(value);
            this.setState({
                'grade_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "phone_number") {
            let error = this.isPhoneNumberError(value);
            this.setState({
                'phone_number_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "gender") {
            let error = this.isEmpty(value);
            this.setState({
                'gender_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "shirt_size") {
            let error = this.isEmpty(value);
            this.setState({
                'shirt_size_error': error
            });
            if (error) {
                return;
            }
        } else if (name === "mlh_agreement") {
            this.setState({
                'mlh_error': !value
            });
            if (!value) {
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
            this.props.updateProfile(old_delta).then((result) => {
                let num_params = Object.getOwnPropertyNames(this.state.delta).length;
                if (num_params > 1) {
                    this.spin();
                } else {
                    this.setState({
                        'out': false
                    });
                }
            }, (error) => {
                window.location.reload(true);
            });
        });
    };

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name === 'is_bgc') {
            value = value === "yes";
            this.setState({
                'is_bgc': value
            });
        } else if (name === 'mlh_agreement') {
            value = !this.state.mlh_agreement;
            this.setState({
                'mlh_agreement': value
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
        this.validateAndSubmit(name, value);
    };
    toNextPage = (e) => {
        e.preventDefault();
        const first_name_error = this.isEmpty(this.state.first_name);
        const last_name_error = this.isEmpty(this.state.last_name);
        const school_error = this.isEmpty(this.state.school);
        const grade_error = this.isGradeError(this.state.grade);
        const phone_number_error = this.isPhoneNumberError(this.state.phone_number);
        const gender_error = this.isEmpty(this.state.gender);
        const shirt_size_error = this.isEmpty(this.state.shirt_size);
        const mlh_error = !this.state.mlh_agreement;
        this.setState({
            'first_name_error': first_name_error,
            'last_name_error': last_name_error,
            'school_error': school_error,
            'grade_error': grade_error,
            'phone_number_error': phone_number_error,
            'gender_error': gender_error,
            'shirt_size_error': shirt_size_error,
            'mlh_error': mlh_error
        });
        if (!(first_name_error || last_name_error || school_error || grade_error ||
                phone_number_error || gender_error || shirt_size_error || mlh_error)) {
            this.toNextPageWait();
        }
    };
    toNextPageWait = () => {
        if (!this.state.out) {
            this.props.setUserState("application");
        } else {
            setTimeout(this.toNextPage, 50);
        }
    };
    setSchoolValue = (value) => {
        this.setState({
            'school': value
        });
        this.validateAndSubmit('school', value);
    };
    setDietaryRestrictionValue = (value) => {
        this.setState({
            'dietary_restrictions': value
        });
        this.validateAndSubmit('dietary_restrictions', value);
    };
    render() {
        const { classes } = this.props;
        return (
            <div key={this.props.show} style={{display: this.props.show ? "block" : "none"}}>
                <Grid container spacing={0} justify={"center"}>
                    <Grid item md={10} sm={10} xs={10}>
                        <h1 className={classes.textField}>Profile</h1>
                        {
                            this.props.applicationsClosed ?
                                <p style={{marginLeft: "8px", marginBottom: "0px"}}>
                                    The application deadline has passed, and you will not be able to edit some fields of
                                    your profile.
                                    If any of the disabled fields are incorrect, please
                                    email <a href="mailto: hello@menlohacks.com">hello@menlohacks.com</a>.
                                </p> :
                                null
                        }
                        <form
                            ref={"form"}
                            onSubmit={this.toNextPage}
                            className={classes.container}
                        >
                            <TextWithValidation
                                label={"First Name *"}
                                value={this.state.first_name}
                                name={"first_name"}
                                handleChange={this.handleChange}
                                error={this.state.first_name_error}
                                errorMessage={"Please enter your first name."}
                                classes={classes}
                            />
                            <TextWithValidation
                                label={"Last Name *"}
                                value={this.state.last_name}
                                name={"last_name"}
                                handleChange={this.handleChange}
                                error={this.state.last_name_error}
                                errorMessage={"Please enter your last name."}
                                classes={classes}
                            />
                            <IntegrationAutosuggest
                                OPTIONS={this.props.CONSTANTS.loading ? []: this.props.CONSTANTS.CONSTANTS.SCHOOLS}
                                margin={"normal"}
                                error={this.state.school_error}
                                name={"school"}
                                value={this.state.school}
                                setValue={this.setSchoolValue}
                                label={"School *"}
                                errorMessage={"Please enter your school."}
                                fullWidth={true}
                                disabled={this.props.applicationsClosed}
                            />
                            <TextWithValidation
                                label={"Grade *"}
                                value={this.state.grade}
                                name={"grade"}
                                handleChange={this.handleChange}
                                error={this.state.grade_error}
                                errorMessage={this.state.grade_error_message}
                                classes={classes}
                            />
                            <TextWithValidation
                                label={"Phone Number *"}
                                value={this.state.phone_number}
                                name={"phone_number"}
                                handleChange={this.handleChange}
                                error={this.state.phone_number_error}
                                errorMessage={this.state.phone_number_error_message}
                                classes={classes}
                            />
                            <FormControl className={classes.textField} margin={"normal"} style={{marginLeft: 0,
                                marginRight: 16}}
                                         error={this.state.gender_error}>
                                <InputLabel htmlFor="gender"  className={classes.textField}>Gender *</InputLabel>
                                <Select
                                    value={this.state.gender}
                                    onChange={this.handleChange}
                                    name={'gender'}
                                    input={<Input id={'gender'} className={classes.textField}/>}
                                    className={classes.textField}
                                >
                                    {
                                        this.props.CONSTANTS.loading ? null :
                                            this.props.CONSTANTS.CONSTANTS.GENDER_OPTIONS.map((object, i) => {
                                                return <MenuItem value={object} key={object}>{object}</MenuItem>
                                            })
                                    }
                                </Select>
                                <FormHelperText
                                    className={classes.textField}
                                    style={this.state.gender_error ? {} : {'display': 'none'}}>
                                    Please select your gender.
                                </FormHelperText>
                            </FormControl>
                            <FormControl className={classes.textField} margin={"normal"} style={{marginLeft: 0,
                                marginRight: '16px'}}
                                         error={this.state.shirt_size_error}>
                                <InputLabel htmlFor="shirt_size"  className={classes.textField}>Shirt Size *</InputLabel>
                                <Select
                                    value={this.state.shirt_size}
                                    onChange={this.handleChange}
                                    name={'shirt_size'}
                                    input={<Input id={'shirt_size'} className={classes.textField}/>}
                                    className={classes.textField}
                                >
                                    {
                                        this.props.CONSTANTS.loading ? null :
                                            this.props.CONSTANTS.CONSTANTS.SHIRT_OPTIONS.map((object, i) => {
                                                return <MenuItem value={object} key={object}>{object}</MenuItem>
                                            })
                                    }
                                </Select>
                                <FormHelperText
                                    className={classes.textField}
                                    style={this.state.shirt_size_error ? {} : {'display': 'none'}}>
                                    Please select your shirt size.
                                </FormHelperText>
                            </FormControl>
                            <IntegrationAutosuggest
                                OPTIONS={this.props.CONSTANTS.loading ? []: this.props.CONSTANTS.CONSTANTS.DIETARY_RESTRICTIONS}
                                margin={"normal"}
                                error={false}
                                value={this.state.dietary_restrictions}
                                setValue={this.setDietaryRestrictionValue}
                                label={"Dietary Restriction"}
                                errorMessage={''}
                                fullWidth={false}
                            />
                            <TextField
                                label={"Link to Github Profile"}
                                margin={"normal"}
                                value={this.state.github_link}
                                name={"github_link"}
                                onChange={this.handleChange}
                                className={classes.textField}
                            />
                            <TextField
                                label={"Link to LinkedIn Profile"}
                                margin={"normal"}
                                value={this.state.linkedin_profile}
                                name={"linkedin_profile"}
                                onChange={this.handleChange}
                                className={classes.textField}
                            />
                            <TextField
                                label={"Link to Devpost Profile"}
                                margin={"normal"}
                                value={this.state.devpost_profile}
                                name={"devpost_profile"}
                                onChange={this.handleChange}
                                className={classes.textField}
                            />
                            <TextField
                                label={"Link to Personal Website"}
                                margin={"normal"}
                                value={this.state.personal_website}
                                name={"personal_website"}
                                onChange={this.handleChange}
                                className={classes.textField}
                            />
                            <FormControl className={classes.textField} margin={"normal"} style={{marginLeft: 0,
                                marginRight: '16px'}}>
                                <InputLabel htmlFor="is_bgc" style={{ width: "350px"}} className={classes.textField}>Are you a member of the Boys and Girls Club?</InputLabel>
                                <Select
                                    value={this.state.is_bgc ? "yes" : "no"}
                                    onChange={this.handleChange}
                                    name={'is_bgc'}
                                    className={classes.textField}
                                    style={{ width: "350px"}}
                                >
                                    <MenuItem value={"yes"} key={true}>
                                        Yes
                                    </MenuItem>
                                    <MenuItem value={"no"} key={false}>
                                        No
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FlexBoxOKNewLine/>
                            <FormControl error={this.state.mlh_error}>
                                <FormControlLabel
                                    style={{marginLeft: '-8px', marginBottom: '8px'}}
                                    control={
                                        <Checkbox
                                            checked={this.state.mlh_agreement}
                                            onChange={this.handleChange}
                                            name={"mlh_agreement"}
                                        />
                                    }
                                    label={
                                        <span>
                                            I agree to the MLH <a href={"https://static.mlh.io/docs/mlh-code-of-conduct.pdf"}
                                                                       target={"_BLANK"} rel={"noopener"}>Code of Conduct</a>. *
                                        </span>}
                                />
                                <FormHelperText style={{marginTop: '-8px', 'marginLeft': '8px', marginBottom: '16px',
                                    display: this.state.mlh_error ? 'block' : 'none'}}>
                                    You must agree to the above.</FormHelperText>
                            </FormControl>
                            <FlexBoxOKNewLine/>
                            <span style={{marginTop: "8px", "marginLeft": "auto", marginRight: "32px"}}>Autosaved</span>
                            <Button raised color={"primary"} type={"submit"} style={{marginLeft: '0'}}>
                                Next
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

export default withStyles(styles)(Profile);

