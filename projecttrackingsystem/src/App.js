import React, {Component} from 'react';
import Projects from "./components/Projects";
import './App.css';
import EditProject from "./components/EditProject";

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectId: 0,
            componentName: "projects"
        };
        this.handler = this.handler.bind(this)
    }

    handler(name, projectId) {
        console.log(projectId)
        this.setState({
            componentName: name,
        })
        this.setState({
            projectId: projectId
        })
    }

    render() {
        const project = () => {
            switch (this.state.componentName) {
                case "projects":
                    return <Projects handler={this.handler}/>;
                case "edit":
                    return <EditProject prijectId={this.state.projectId} handler={this.handler}/>;

                default:
                    return <Projects handler={this.handler}/>
            }
        }
        return (
            <div>{project()}</div>
        )
    }
}

export default App;
