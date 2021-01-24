import React, {Component} from 'react';
import axios from "axios";
import {Table} from 'react-bootstrap';
import img from "../images/close.png";

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            projectNames: [],
        };
    }

    componentDidMount() {
        axios.get('/getAllProjects')
            .then((res) => {
                res.data.map((data) => (
                    this.setState(prevState => ({
                        projectNames: [...prevState.projectNames, JSON.parse('{"projectName": ' + '"' + data.projectName + '"}')]
                    })),
                        this.setState(prevState => ({
                            projects: [...prevState.projects, data]
                        }))
                ));
            }).catch((error) => {
            console.log(error)
        });
    }

    imageClick = (projectId1) => {
        let url = '/delete/project/' + projectId1
        axios.delete(url)
            .then((res) => {
                console.log(res)
            }).catch((error) => {
            console.log(error)
        });
        const newList = this.state.projects.filter((item) => item.projectId !== projectId1);
        this.setState({
            projects: newList
        })
    }

    render() {
        return (
            <div className="parent">
                <h3 className="projects-list">Projects List</h3>
                <div className="content">
                    <div className="table-container">
                        <Table className="table-container__table">
                            <thead>
                            <tr>
                                <th width="30" height="30"/>
                                <th>Project</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.projects.map((data) => (
                                <tr>
                                    <td width="30" height="30">
                                        <img src={img} onClick={() => this.imageClick(data.projectId)} width="25"
                                             height="25" alt=""/>
                                    </td>
                                    <td onClick={() => this.props.handler('edit', data.projectId)}>{data.projectName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <button onClick={() => this.props.handler('edit')} type="button" className="add-button">Add</button>
                </div>
            </div>
        );
    }
}

export default Projects;