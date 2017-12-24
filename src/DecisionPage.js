import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import filestack from 'filestack-js';
const apikey = 'AKOHZFGyDQgekYH95idduz';
const client = filestack.init(apikey);

class DecisionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coming_yes: false,
            coming_maybe: false,
            coming_no: false,
            'liability_form': '',
            'photo_form': '',
        };
        this.initialize_state();
    }

    initialize_state = () => {
        if (this.props.DecisionInformation.loading) {
            this.timeout = setTimeout(() => {this.initialize_state()}, 50);
            return;
        }
        let application = this.props.DecisionInformation.application;
        if (application) {
            this.setState({
                'coming_yes': application.coming_yes,
                'coming_maybe': application.coming_maybe,
                'coming_no': application.coming_no,
                'liability_form': application.liability_form ? application.liability_form : '',
                'photo_form': application.photo_form ? application.photo_form : ''
            });
        }
    };

    coming_yes = () => {
        this.setState({
            coming_yes: true,
            coming_maybe: false,
            coming_no: false
        });
        this.props.updateApplication({coming_yes: true, token: this.props.token});
    };
    coming_maybe = () => {
        this.setState({
            coming_yes: false,
            coming_maybe: true,
            coming_no: false
        });
        this.props.updateApplication({coming_maybe: true, token: this.props.token});
    };
    coming_no = () => {
        this.setState({
            coming_yes: false,
            coming_maybe: false,
            coming_no: true
        });
        this.props.updateApplication({coming_no: true, token: this.props.token});
    };

    uploadForm = (name) => {
        client.pick({fromSources: ["local_file_system", "dropbox"], maxFiles: 1}).then((res) => {
            if (res.filesUploaded.length > 0) {
                let updated = {};
                updated[name] = res.filesUploaded[0].url;
                this.setState(updated);
                this.props.updateApplication({...updated, token: this.props.token});
            }
        })
    };

    render() {
        if (this.props.show) {
            return (
                <div>
                    <Grid container spacing={0} justify={"center"}>
                        <Grid item md={10} sm={10} xs={10}>
                            {
                                !this.props.DecisionInformation.loading ?
                                    this.props.DecisionInformation.application.is_admitted ?
                                        <div>
                                            <h1>Congrats! You got in!</h1>
                                            <p>
                                                Congratulations! You were selected for MenloHacks particularly because of
                                                your unique passion and experience. <br/> We hope you can make it!
                                            </p>
                                            <h3>
                                                Can you come?
                                            </h3>
                                            <Button raised={!this.state.coming_yes} disabled={this.state.coming_yes}
                                                    style={{backgroundColor: "#33ff33", color: "black"}}
                                                    onClick={this.coming_yes}
                                            >
                                                Yes!
                                            </Button>
                                            <Button raised={!this.state.coming_maybe} disabled={this.state.coming_maybe}
                                                    style={{backgroundColor: "#ffff33", color: "black"}}
                                                    onClick={this.coming_maybe}
                                            >
                                                maybe
                                            </Button>
                                            <Button raised={!this.state.coming_no} disabled={this.state.coming_no}
                                                    style={{backgroundColor: "#ff3333", color: "black"}}
                                                    onClick={this.coming_no}
                                            >
                                                no
                                            </Button>
                                            {
                                                this.state.coming_yes ?
                                                    <div>
                                                        <p>
                                                            Great! We'll be in touch with
                                                            more information soon. In the meantime, please fill out and
                                                            upload the forms below if you haven't already.
                                                        </p>
                                                        <p style={{marginTop: '8px', marginBottom: '-8px'}}>
                                                            In order to attend MenloHacks, you must upload a signed copy
                                                            of <a href={!this.props.CONSTANTS.loading ? (this.props.userState === "menlo_application" ? this.props.CONSTANTS.CONSTANTS.MENLO_FORM_URL : this.props.CONSTANTS.CONSTANTS.NON_MENLO_FORM_URL) : ''} target={"_blank"} rel={"noopener"}>our liability waiver</a>.
                                                        </p>
                                                        <br/>
                                                        <Button raised type={"secondary"}
                                                                onClick={() => {this.uploadForm("liability_form")}}>
                                                            Upload
                                                        </Button>
                                                        <br/>
                                                        {
                                                            this.state.liability_form ?
                                                                <p style={{marginTop: '8px', marginBottom: '8px'}}>
                                                                    View your <a target={"_blank"} rel={"noopener"} href={this.state.liability_form}>uploaded liability form.</a>
                                                                </p> :
                                                                <p style={{marginTop: '8px', marginBottom: '8px'}}>
                                                                    You have not yet uploaded this form.
                                                                </p>
                                                        }
                                                        <br/>

                                                        <p style={{marginTop: '16px', marginBottom: '-4px'}}>
                                                            In order to attend MenloHacks, you must upload a signed copy
                                                            of <a href={!this.props.CONSTANTS.loading ? this.props.CONSTANTS.CONSTANTS.PHOTO_FORM_URL : ""} target={"_blank"} rel={"noopener"}>our photo release form</a>.
                                                        </p>
                                                        <br/>
                                                        <Button raised type={"secondary"}
                                                            onClick={() => {this.uploadForm("photo_form")}}>
                                                        Upload
                                                        </Button>
                                                        <br/>
                                                        {
                                                            this.state.photo_form ?
                                                                <p style={{marginTop: '8px', marginBottom: '8px'}}>
                                                                    View your <a target={"_blank"} href={this.state.photo_form} rel={"noopener"}>uploaded photo release form.</a>
                                                                </p> :
                                                                <p style={{marginTop: '8px', marginBottom: '8px'}}>
                                                                    You have not yet uploaded this form.
                                                                </p>
                                                        }
                                                        <br/>
                                                    </div>
                                                    :
                                                    this.state.coming_maybe ?
                                                        <p>
                                                            Ok. Visit this page again soon to let us know if you can come.
                                                            We hope to see you at MenloHacks!
                                                        </p>
                                                        :
                                                        this.state.coming_no ?
                                                            <p>
                                                                Sorry to hear that. We hope to see you at MenloHacks IV!
                                                            </p>
                                                            :
                                                            null
                                            }

                                        </div> :
                                        this.props.DecisionInformation.application.is_waitlisted ?
                                            <div>
                                                <h1>You've been Waitlisted</h1>
                                                <p>
                                                Unfortunately, due to an overwhelming number of applications, you were not
                                                    admitted in the first round of acceptances, so you have been placed on
                                                    a waiting list.  We will be accepting students on the waitlist on a
                                                    rolling basis, so make sure to stay tuned for any updates.
                                                </p>
                                            </div> :
                                            this.props.DecisionInformation.application.is_ineligible ?
                                                <div>
                                                    <h1>You are not eligible to attend MenloHacks</h1>
                                                    <p>
                                                        MenloHacks is a high school event and we noticed you are
                                                        in college. If this is an error or you are interested in mentoring,
                                                        please email <a href="mailto:hello@menlohacks.com">hello@menlohacks.com</a>.
                                                    </p>
                                                </div> :
                                                this.props.DecisionInformation.application.is_rejected ?
                                                    <div>
                                                        <h1>You were not admitted to MenloHacks</h1>
                                                        <p>
                                                            We regret to inform you that, due to an extremely competitive
                                                            applicant pool, we are not able to offer you a spot at
                                                            MenloHacks III. We urge you to apply again next year.
                                                        </p>
                                                    </div> :
                                                    <div>
                                                        <h1>Something went wrong</h1>
                                                        <p>
                                                            If you see this message, please
                                                            email <a href="mailto:hello@menlohacks.com">hello@menlohacks.com</a>.
                                                        </p>
                                                    </div> :
                                    null
                            }

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
export default DecisionPage;