import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';


const styles = theme => ({
    // container: {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     'z-index': 10000000,
    //     'margin-top': '16px',
    //     'margin-bottom': '8px'
    // },
    // suggestionsContainerOpen: {
    //     'margin-top': '5vh',
    //     position: 'absolute',
    //     marginTop: theme.spacing.unit,
    //     marginBottom: theme.spacing.unit,
    //     left: 0,
    //     right: 0,
    //     'z-index': 10000000
    // },
    // suggestion: {
    //     display: 'block',
    //     'z-index': 10000000
    // },
    // suggestionsList: {
    //     margin: 0,
    //     padding: 0,
    //     listStyleType: 'none',
    //     'z-index': 10000000
    // },
    // textField: {
    //     'z-index': 10000000,
    //     marginLeft: theme.spacing.unit,
    //     marginRight: theme.spacing.unit,
    //     width: 200,
    // },

        container: {
            position: 'relative',
            'margin-top': '16px',
            'margin-bottom': '8px',
            'margin-left': '8px',
            'margin-right': '8px',
            width: '416px'
        },
        container_no_grow: {
            position: 'relative',
            'margin-top': '16px',
            'margin-bottom': '8px',
            'margin-left': '8px',
            'margin-right': '8px',
            width: '200px'
        },
        suggestionsContainerOpen: {
            position: 'absolute',
            marginTop: theme.spacing.unit,
            marginBottom: theme.spacing.unit * 3,
            left: 0,
            right: 0,
            'z-index': 10000000
        },
        suggestion: {
            display: 'block',
            'z-index': 10000000
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none',
            'z-index': 10000000
        },
        textField: {
            width: '100%',
        }

});

class IntegrationAutosuggest extends React.Component {
    state = {
        suggestions: [],
    };

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, { newValue }) => {
        this.props.setValue(newValue);
    };


    renderInput = (inputProps) => {
        const { classes, value, ref, error, fullWidth, error_message, label, disabled, ...other } = inputProps;

        return (
            <FormControl fullWidth={this.props.fullWidth} error={!!inputProps.error}>
                <TextField
                    error={!!error}
                    className={classes.textField}
                    value={value}
                    inputRef={ref}
                    label={label}
                    disabled={disabled}
                    InputProps={{
                        classes: {
                            input: classes.input,
                        },
                        ...other,
                    }}
                    fullWidth={fullWidth}
                />
                <FormHelperText
                    className={classes.textField}
                    style={error ? {} : {'display': 'none'}}>
                    {error_message}
                </FormHelperText>
            </FormControl>
        );
    };

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const matches = match(suggestion, query);
        const parts = parse(suggestion, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
                        ) : (
                            <strong key={index} style={{ fontWeight: 500 }}>
                                {part.text}
                            </strong>
                        );
                    })}
                </div>
            </MenuItem>
        );
    };

    renderSuggestionsContainer = (options) => {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    };

    getSuggestionValue = (suggestion) => {
        return suggestion;
    };

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        if (this.props.allow_zerosuggest && inputLength === 0) {
            return this.props.OPTIONS;
        }

        return inputLength === 0
            ? []
            : this.props.OPTIONS.filter(suggestion => {
                const keep =
                    count < 5 && suggestion.toLowerCase().includes(inputValue);
                if (keep) {
                    count += 1;
                }

                return keep;
            });
    };


    render() {
        const { classes } = this.props;

        return (
            <Autosuggest
                theme={{
                    container: this.props.fullWidth ? classes.container : classes.container_no_grow,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={this.renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                shouldRenderSuggestions={(value) => true}
                inputProps={{
                    classes,
                    value: this.props.value,
                    onChange: this.handleChange,
                    error:this.props.error ? 1 : 0,
                    label: this.props.label,
                    error_message: this.props.errorMessage,
                    fullWidth: this.props.fullWidth,
                    disabled: this.props.disabled,
                    autoComplete: "nope"
                }}
            />
        );
    }
}

IntegrationAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);