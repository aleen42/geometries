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
 *  - Document: geometries.jsx
 *  - Author: aleen42
 *  - Description: component of geometries parser
 *  - Create Time: Feb 13rd, 2019
 *  - Update Time: Feb 13rd, 2019
 *
 */

const PropTypes = require('prop-types');
const React = require('react');
const Parser = require('modules/compilers/parser/parser');

class Geometries extends React.Component {
    constructor(props) {
        super(props);
        this.setInput = this.setInput.bind(this);
        this.state = {
            input: '',
        };
    }

    setInput(input) {
        this.setState({input});
    }

    componentDidUpdate() {
        const self = this;
        let pointsArr = [];
        const pathsArr = [];

        new Parser(self.state.input, {
            drawingCallback: (x, y) => {
                pointsArr.push(x);
                pointsArr.push(y);
            },
            lineCompleted: () => {
                pathsArr.push(`<path fill="none" stroke="${self.props.color}"
                    stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                    d="M${pointsArr.shift()},${pointsArr.shift()}L${pointsArr.join(' ')}"/>`);
                /** reset storing points of each line */
                pointsArr = [];
            },
            drawingCompleted: () => {
                /** render */
                self.svg.innerHTML = pathsArr.join('\n');
            },
        });
    }

    render() {
        return <div className="geometries-wrapper">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width={this.props.size} height="500px"
                ref={svg => {
                    this.svg = svg;
                }}/>
        </div>;
    }
}

Geometries.defaultProps = {
    size: 500,
    color: '#93A1A1',
};

Geometries.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
};

module.exports = Geometries;
