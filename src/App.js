import React, { Component } from 'react';
import './App.css';
import { ApolloProvider, graphql } from 'react-apollo';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import ApolloClient from 'apollo-client-preset';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import 'sweetalert2/dist/sweetalert2.css'
import { compose } from 'react-apollo';
import Profile from './Profile';
import Application from './Application';
import RegisterOrLogin from './Register'
import Cookies from 'js-cookie';
import { onError } from 'apollo-link-error'
import {SendReset, SentReset, PasswordReset, ResetPasswordFinished, ResetPasswordFailed} from './SendReset';
import DecisionPage from './DecisionPage';
const theme = createMuiTheme();


const logoutLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        if (graphQLErrors[0].message === "jwt expired") {
            Cookies.remove('token');
            document.location.reload();
        }
    }

});


const client = new ApolloClient({
    link: logoutLink.concat(new HttpLink({ uri: 'https://tergum.menlohacks.com/graphql' })),
    cache: new InMemoryCache()
});

const GET_CONSTANTS = gql`
{
    CONSTANTS {
        SHIRT_OPTIONS,
        EMAIL_REGEX,
        SCHOOLS,
        MAX_GRADE,
        PHONE_REGEX,
        GENDER_OPTIONS,
        RACE_ETHNICITY_OPTIONS,
        SHIRT_OPTIONS,
        DIETARY_RESTRICTIONS,
        MENLO_FORM_URL,
        NON_MENLO_FORM_URL,
        PHOTO_FORM_URL,
        APPLICATIONS_CLOSE,
        REGISTRATION_CLOSES,
        DISABLED_AFTER_APPLICATIONS_CLOSE
    }
}`;

const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const createUser = gql`
  mutation createUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password)
  }
`;

const getUserState = gql`
    query user($token: String!) {
        user(token: $token) {
            user_state
        }
    }
`;

const setUserState = gql`
    mutation set_user_state($user_state: String!, $token: String!) {
        set_user_state(user_state: $user_state, token: $token)
    }
`;

const getProfile = gql`
    query profileFull($token: String!) {
        profile(token: $token) {
            first_name,
            last_name,
            school,
            grade,
            phone_number,
            gender,
            race_ethnicity,
            dietary_restrictions,
            shirt_size,
            github_link,
            linkedin_profile
            devpost_profile,
            personal_website,
            is_bgc,
            mlh_agreement,
            mlh_data_agreement
        }
    }
`;
const getApplication = gql`
    query getApplication($token: String!) {
        application(token: $token) {
            cool_project,
            last_summer,
            anything_else,
            liability_form,
            photo_form,
            submitted
        }
    }
`;

const updateProfile = gql`
    mutation updateProfile($first_name: String, $last_name: String, $school: String, $grade: Int, $phone_number: String,
                           $gender: String, $race_ethnicity: String, $dietary_restrictions: String, $shirt_size: String, $github_link: String, 
                           $linkedin_profile: String, $devpost_profile: String, $personal_website: String, 
                           $is_bgc: Boolean, $mlh_agreement: Boolean, $mlh_data_agreement: Boolean, $token: String!) {
        updateProfile(first_name: $first_name, last_name: $last_name, school: $school, grade: $grade, phone_number: $phone_number,
                      gender: $gender, race_ethnicity: $race_ethnicity, dietary_restrictions: $dietary_restrictions, shirt_size: $shirt_size,
                      github_link: $github_link, linkedin_profile: $linkedin_profile, devpost_profile: $devpost_profile,
                      personal_website: $personal_website, is_bgc: $is_bgc, mlh_agreement: $mlh_agreement, 
                      mlh_data_agreement: $mlh_data_agreement, token: $token)
    }
`;

const updateApplication = gql`
    mutation updateApplication($cool_project: String, $last_summer: String, $anything_else: String, 
                               $liability_form: String, $photo_form: String, $coming_yes: Boolean, 
                               $coming_maybe: Boolean, $coming_no: Boolean, $submitted: Boolean, $token: String!) {
        updateApplication(cool_project: $cool_project, last_summer: $last_summer, anything_else: $anything_else,
                          liability_form: $liability_form, photo_form: $photo_form, coming_yes: $coming_yes, 
                          coming_maybe: $coming_maybe, coming_no: $coming_no, submitted: $submitted, token: $token)
    }
`;

const sendReset = gql`
    mutation sendReset($email: String!) {
        send_reset(email: $email)
    }
`;

const resetPassword = gql`
    mutation reset_password($new_password: String!, $token: String!) {
        reset_password(new_password: $new_password, token: $token)
    }
`;

// Returns false for all decisions stuff if decisions aren't released yet- don't try to be sneaky
const getDecisionInformation = gql`
    query getDecisionInformation($token: String!) {
        application(token: $token) {
            liability_form,
            photo_form,
            is_admitted,
            is_waitlisted,
            is_rejected,
            is_ineligible,
            coming_yes,
            coming_no,
            coming_maybe
        }
    }
`;


const ProfileWithData = compose(
    graphql(getProfile, {
        name: 'Profile'
    }),
    graphql(updateProfile, {
        props: ({mutate}) => ({
            updateProfile: (delta) => mutate({variables: delta})
        })
    }),

)(Profile);

const ApplicationWithData = compose(
    graphql(getApplication, {
        name: 'Application'
    }),
    graphql(updateApplication, {
        props: ({mutate}) => ({
            updateApplication: (delta) => mutate({variables: delta})
        })
    }),
)(Application);

const SendResetWithData = graphql(sendReset, {
    props: ({mutate}) => ({
        send_reset: (email) => mutate({variables: {email: email}})
    })
})(SendReset);

const ResetPasswordWithData = graphql(resetPassword, {
    props: ({mutate}) => ({
        reset_password: (new_password, token) => mutate({variables: {new_password, token}})
    })
})(PasswordReset);

const DecisionPageWithData = compose(
    graphql(getDecisionInformation, {
        name: 'DecisionInformation'
    }),
    graphql(updateApplication, {
        props: ({mutate}) => ({
            updateApplication: (delta) => mutate({variables: delta})
        })
    }),
)(DecisionPage);

const Logo = ({props}) => {
    return <img src="https://d2b6s0dsvfyqsi.cloudfront.net/menlohacks_icon.svg" alt="MenloHacks logo"
                style={{width: "50px", height: "auto", marginLeft: "16px", marginTop: "8px"}}/>;
};

class UserManager extends Component {
    constructor(props) {
        super(props);
        let token = Cookies.get('token');
        if (token) {
            this.state = {
                "token": token,
            };
            this.directToLoggedInState();
        } else {
            let url = window.location.href;
            if (url.includes("reset_password")) {
                this.state = {
                    "token": url.split("reset_password=")[1],
                    "userState": "resetPassword",
                };
            } else if(url.includes("register")) {
                this.state = {
                    "token": null,
                    "userState": "register",
                };
            }
            else {
                this.state = {
                    "token": null,
                    "userState": "login",
                };
            }
        }
        this.setUserState = this.setUserState.bind(this);
    }
    setUserState(state) {
        if (state === "application" || (state === "profile" && (this.state.userState === "application" ||
                this.state.userState === "bgc_application" || this.state.userState === "menlo_application"))) {
            client.mutate({mutation: setUserState,
                variables: {token: this.state.token, user_state: state}}).then((state_to_set) => {
                this.setState({"userState": state_to_set.data.set_user_state});
            }, (error) => {
                console.log(error);
            });
        } else {
            this.setState({"userState": state});
        }
    };

    registerWithPurge = (email, password, error, success) => {
        this.props.createUser(email, password).then((data) => {
            this.setToken(data.data.createUser);
            window.location = window.location.pathname;
        }, (e) => {
            error(e);
        });
    };
    loginWithPurge = (email, password, error, success) =>  {
        this.props.login(email, password).then((data) => {
            this.setToken(data.data.login);
            window.location = window.location.pathname;
        }, (e) => {
            error(e);
        });
    };
    logout = () => {
        this.setState({
            "token": null
        });
        Cookies.remove("token");
        this.setUserState("login");
    };
    setToken = (token) => {
        Cookies.set('token', token);
        this.setState({
            'token': token
        });
        this.directToLoggedInState();
    };
    directToLoggedInState = () => {
        client.query({query: getUserState, variables: {token: this.state.token}}).then((data) => {
            this.setState({
                'userState': data.data.user.user_state
            });
        }, (error) => {
            console.log(error);
        });
    };

    render() {
        if (this.state.userState === "login" || this.state.userState === "register" ||
            this.state.userState === "sendReset" || this.state.userState === "sentReset" ||
            this.state.userState === "resetPassword" || this.state.userState === "resetPasswordFinished" ||
            this.state.userState === "resetPasswordFailed") {
            return (
                <div>
                    <Logo/>
                    <RegisterOrLogin className={"center-block"}
                                     title={'Log in'}
                                     registerOrLogin={this.loginWithPurge}
                                     show={this.state.userState === "login"}
                                     setUserState={this.setUserState}
                                     CONSTANTS={this.props.CONSTANTS}
                                     toggleBetween={
                                         !this.props.CONSTANTS.loading ?
                                             new Date() > new Date(parseInt(this.props.CONSTANTS.CONSTANTS.APPLICATIONS_CLOSE, 10)) ?
                                                 new Date() > new Date(parseInt(this.props.CONSTANTS.CONSTANTS.REGISTRATION_CLOSES, 10)) ?
                                                     <span>
                                                         Registration is now closed.
                                                     </span>
                                                     :
                                                     <span>Registration is now closed to non-Menlo students.
                                                         <Button onClick={() => this.setUserState("register")}>Menlo Student Registration</Button>
                                                     </span>
                                                 :
                                                 <span>Don't have an account?
                                                    <Button onClick={() => this.setUserState("register")}>Register</Button>
                                                 </span>
                                             :
                                             <span>Don't have an account?
                                                <Button  onClick={() => this.setUserState("register")}>Register</Button>
                                             </span>
                                     }
                    />
                    <RegisterOrLogin
                        title='Register'
                        registerOrLogin={this.registerWithPurge}
                        show={this.state.userState === "register"}
                        setUserState={this.setUserState}
                        CONSTANTS={this.props.CONSTANTS}
                        toggleBetween={
                            <Button raised onClick={() => this.setUserState("login")}>Back to login</Button>
                        }
                    />
                    <SendResetWithData
                        show={this.state.userState === "sendReset"}
                        setUserState={this.setUserState}
                        CONSTANTS={this.props.CONSTANTS}
                    />
                    <SentReset
                        show={this.state.userState === "sentReset"}
                        setUserState={this.setUserState}
                    />
                    <ResetPasswordWithData
                        show={this.state.userState === "resetPassword"}
                        token={this.state.token}
                        setUserState={this.setUserState}
                    />
                    <ResetPasswordFinished
                        show={this.state.userState === "resetPasswordFinished"}
                        setUserState={this.setUserState}
                    />
                    <ResetPasswordFailed
                        show={this.state.userState === "resetPasswordFailed"}
                        setUserState={this.setUserState}
                    />
                </div>

            )
        } else if (this.state.userState === "profile" || this.state.userState === "bgc_application" ||
            this.state.userState === "menlo_application" || this.state.userState === "application") {
            let applicationsClosed = !this.props.CONSTANTS.loading ?
                    new Date() > new Date(parseInt(this.props.CONSTANTS.CONSTANTS.APPLICATIONS_CLOSE, 10)):
                    false;
            return (
                <div>
                    <Logo/>
                    <Button style={{float: "right"}} onClick={this.logout}>Logout</Button>
                    <ProfileWithData
                        CONSTANTS={this.props.CONSTANTS}
                        setUserState={this.setUserState}
                        token={this.state.token}
                        show={this.state.userState === "profile"}
                        applicationsClosed={applicationsClosed}
                    >
                    </ProfileWithData>
                    <ApplicationWithData
                        CONSTANTS={this.props.CONSTANTS}
                        setUserState={this.setUserState}
                        token={this.state.token}
                        userState={this.state.userState}
                        show={this.state.userState === "application" || this.state.userState === "menlo_application" ||
                            this.state.userState === "bgc_application"}
                        applicationsClosed={applicationsClosed}
                    >
                    </ApplicationWithData>
                </div>
            )
        } else if (this.state.userState === "decision") {
            return (
                <div>
                    <Logo/>
                    <Button style={{float: "right"}} onClick={this.logout}>Logout</Button>
                    <DecisionPageWithData
                        token={this.state.token}
                        show={this.state.userState === "decision"}
                        CONSTANTS = {this.props.CONSTANTS}
                    />
                </div>
            )
        } else {
            return (null);
        }

    }
}

const UserManagerWithData = compose(
    graphql(login, {
        props: ({mutate}) => ({
            login: (email, password) => mutate({variables: {email, password}})
        })
    }),
    graphql(createUser, {
        props: ({mutate}) => ({
            createUser: (email, password) => mutate({variables: {email, password}})
        })
    }),
    graphql(GET_CONSTANTS, {
        name: 'CONSTANTS'
    })
)(UserManager);


class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <div className="application">
                <MuiThemeProvider theme={theme}>
                    <UserManagerWithData>
                    </UserManagerWithData>
                </MuiThemeProvider>
            </div>
        </ApolloProvider>
    );
  }
}

export {App as default}
