/**
 *                                                               _
 *   _____  _                           ____  _                 |_|
 *  |  _  |/ \   ____  ____ __ ___     / ___\/ \   __   _  ____  _
 *  | |_| || |  / __ \/ __ \\ '_  \ _ / /    | |___\ \ | |/ __ \| |
 *  |  _  || |__. ___/. ___/| | | ||_|\ \___ |  _  | |_| |. ___/| |
 *  |_/ \_|\___/\____|\____||_| |_|    \____/|_| |_|_____|\____||_|
 *
 *  ===============================================================
 *             More than a coder, More than a designer
 *  ===============================================================
 *
 *  - Document: index.js
 *  - Author: aleen42
 *  - Description: The main entry of this application
 *  - Create Time: May 30th, 2017
 *  - Update Time: Feb 13rd, 2019
 *
 */

require('./index.less');

require('brace');
require('brace/mode/typescript');
require('brace/theme/solarized_dark');

const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');

const Geometries = require('components/geometries');
const AceEditor = require('react-ace').default;

const cases = [
    require('cases/1.ge'),
    require('cases/2.ge'),
    require('cases/3.ge'),
    require('cases/4.ge'),
];

let value = cases[2];
class View extends React.Component {
    constructor(props) {
        super(props);
        this.handleConvert = this.handleConvert.bind(this);
        this.state = {
            value: props.value,
        };
    }

    componentDidMount() {
        this.handleConvert();
    }

    componentDidUpdate() {
        this.handleConvert();
    }

    handleConvert() {
        this.geometries.setInput(this.state.value);
    }

    render() {
        const size = 400;
        return <div className="view-container">
            <div className="brand">Geometries</div>
            <Geometries size={size} ref={geometries => {
                this.geometries = geometries;
            }}/>
            <AceEditor
                name="ace-editor"
                className="ace-editor"
                mode="typescript"
                theme="solarized_dark"
                onChange={val => { value = val; }}
                fontSize={16}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.value}
                width={`calc(100% - ${size}px)`}
                height="100%"
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                }}
                markers={[{ startRow: 0, startCol: 2, endRow: 1, endCol: 20, className: 'error-marker', type: 'background' }]}
            />
            <div className="buttons" style={{width: `calc(100% - ${size + 51}px)`}}>
                {cases.map((c, index) => <button key={index} onClick={() => {
                    value = c;
                    this.setState({value: c});
                }}>Demo {index + 1}</button>)}
                <button onClick={() => {
                    this.setState({value});
                }}>Convert</button>
            </div>
        </div>;
    }
}

View.propTypes = {
    value: PropTypes.string,
};

ReactDOM.render(
    <View value={value}/>,
    document.querySelector('.container'),
);
