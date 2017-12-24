import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import SweetAlert from 'sweetalert2-react';

//import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator, ValidatorForm} from 'react-material-ui-form-validator';



const styles = theme => ({

});

class RegisterOrLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "profile": false,
            "application": false
        };

    }
    render() {
        if (this.props.show) {
            return (
                <div>

                </div>
            )
        } else {
            return null;
        }

    }
}

export default withStyles(styles)(RegisterOrLogin);

