import React, { Component } from 'react';
import { FormControl, FormHelperText} from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

function FlexBoxOKNewLine(props) {
    return <div style={{width: '100%'}}></div>;
}

class TextWithValidation extends Component {
    render() {
        const { classes } = this.props;
        return (
            <FormControl className={classes.textField} error={this.props.error} margin={"normal"}>
                <InputLabel htmlFor={this.props.name}>{this.props.label}</InputLabel>
                <Input id={this.props.name} value={this.props.value} name={this.props.name}
                       onChange={this.props.handleChange} error={this.props.error}
                />
                <FormHelperText style={{'display': this.props.error ? 'block': 'none'}}>{this.props.errorMessage}</FormHelperText>
            </FormControl>
        )
    }
}

export {FlexBoxOKNewLine, TextWithValidation};