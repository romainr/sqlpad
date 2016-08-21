var React = require('react');
var _ = require('_');

function cleanBoolean (value) {
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            value = true;
        } else if (value.toLowerCase() === "false") {
            value = false;
        }
    }
    return value;
}

var chartDefinitions = require('./ChartDefinitions.js');

/*
sqlpad                  taucharts               label
line                    line                    Line
bubble                  scatterplot             Scatterplot
bar                     horizontalBar           Bar - Horizontal
verticalbar             bar                     Bar - Vertical 
stacked-bar-vertical    stacked-bar             Stacked Bar - Vertical
stacked-bar-horizontal  horizontal-stacked-bar  Stacked Bar - Horizontal

*/

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Checkbox = require('react-bootstrap/lib/Checkbox');

var ChartInputs = React.createClass({
    changeChartConfigurationField: function (chartFieldId, queryResultField) {
        this.props.onChartConfigurationFieldsChange(chartFieldId, queryResultField);
    },
    render: function () {
        var queryChartConfigurationFields = this.props.queryChartConfigurationFields || {};
        var queryResult = this.props.queryResult;
        var queryResultFields = (queryResult && queryResult.fields ? queryResult.fields : []);
        var chartInputDefinition = _.findWhere(chartDefinitions, {chartType: this.props.chartType});

        if (chartInputDefinition && chartInputDefinition.fields) {
            
            var dropdownNodes = chartInputDefinition.fields.map((field) => {
                
                var onFieldDropdownChange = (e) => {
                    this.changeChartConfigurationField(field.fieldId, e.target.value);
                }

                var onCheckboxChange = (e) => {
                    this.changeChartConfigurationField(field.fieldId, e.target.checked)
                }
                
                if (field.inputType == 'field-dropdown') {
                    var optionNodes = queryResultFields.map(function (qrfield) {
                        return (
                            <option key={qrfield} value={qrfield}>{qrfield}</option>
                        )
                    });
                    var selectedQueryResultField = queryChartConfigurationFields[field.fieldId];
                    if (queryResultFields.indexOf(selectedQueryResultField) == -1) { 
                        optionNodes.push(function () {
                            return (
                                <option key={'selectedQueryResultField'} value={selectedQueryResultField}>{selectedQueryResultField}</option>
                            )
                        }());
                    }
                    return (
                        <FormGroup key={field.fieldId} controlId={field.fieldId} bsSize="small">
                            <ControlLabel>{field.label}</ControlLabel>
                            <FormControl 
                                value={selectedQueryResultField}
                                onChange={(e) => {
                                    this.changeChartConfigurationField(field.fieldId, e.target.value);
                                }}  
                                componentClass="select" 
                                className="input-small">
                                    <option value=""></option>
                                    {optionNodes}
                            </FormControl>
                        </FormGroup>
                    )
                } else if (field.inputType == 'checkbox') {

                    var checked = cleanBoolean(queryChartConfigurationFields[field.fieldId]) || false;
                    return (
                        <FormGroup key={field.fieldId} controlId={field.fieldId} bsSize="small">
                            <Checkbox checked={checked} onChange={onCheckboxChange}>
                                {field.label}
                            </Checkbox>
                        </FormGroup>
                    )
                }
            });

            return (
                <div>
                    {dropdownNodes}
                </div>
            );
        }
        return null;
    }
});

module.exports = ChartInputs;