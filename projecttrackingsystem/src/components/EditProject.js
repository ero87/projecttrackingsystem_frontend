import React, {Component} from 'react';
import {Table} from "react-bootstrap";
import img from "../images/close.png";
import axios from "axios";

class EditProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            projectId: -1,
            projectName: "",
            status: "--Select status--",
            fields: {},
            errors: {},
            title: "Project Edit Form"
        };
    }

    componentDidMount() {
        let url = '/get/contacts/' + this.props.prijectId
        if (this.props.prijectId === undefined) {
            this.setState(prevState => ({
                title: "New Project Form",
                contacts: [...prevState.contacts, JSON.parse('{"contactFullName": "", "email": "", "phone": ""}')]
            }))
        } else {
            axios.get(url)
                .then((res) => {
                    res.data.map((data) => (
                        this.setState(prevState => ({
                            contacts: [...prevState.contacts, data]
                        }))
                    ));
                    let fields = this.state.fields;
                    if (this.state.contacts.length !== 0) {
                        this.setState(prevState => ({
                            projectId: this.state.contacts[0].projectEntity.projectId,
                            projectName: this.state.contacts[0].projectEntity.projectName,
                            status: this.state.contacts[0].projectEntity.status
                        }))
                    }
                    this.state.contacts.map((data) => (
                        fields["contactFullName"] = data.contactFullName,
                            fields["email"] = data.email
                    ));
                    fields["projectName"] = this.state.projectName
                    fields["status"] = this.state.status
                    this.setState({fields});
                }).catch((error) => {
                console.log(error)
            });
        }
    }

    imageClick = (contactId) => {
        console.log(this.state.project)
        const newList = this.state.contacts.filter((item) => item.contactId !== contactId);
        this.setState({
            contacts: newList
        })
    }

    addContact = () => {
        console.log(this.state.fields)
        this.setState(prevState => ({
            contacts: [...prevState.contacts, JSON.parse('{"contactFullName": "", "email": "", "phone": ""}')]
        }))
    }

    saveAndClose = () => {
        if (this.handleValidation()) {
            let url = '/update/data'
            const article = {
                projectId: this.state.projectId,
                projectName: this.state.projectName,
                status: this.state.status,
                contacts: this.state.contacts
            };
            console.log(article)
            axios.patch(url, article)
                .then((res) => {
                    console.log(res)
                    this.props.handler('projects', this.state.projectId)
                }).catch((error) => {
                console.log(error)
            });

        }
    }

    clickCancel = () => {
        this.props.handler('projects', this.state.projectId)
    }

    handleChangeProjectName(e) {
        let fields = this.state.fields;
        fields["projectName"] = e.target.value;
        this.setState({fields});
        this.setState({
            projectName: e.target.value
        })
    }

    handleChangeStatus(e) {
        let errors = {};
        let fields = this.state.fields;
        fields["status"] = e.target.value;
        this.setState({fields});
        this.setState({
            status: e.target.value
        })
        this.setState({errors: errors});
    }

    handleChangeContactName(e, oldData, index) {
        this.state.contacts.map((data, index1) => {
                let fields = this.state.fields;
                if (oldData === data.contactFullName && index === index1) {
                    fields["contactFullName"] = e.target.value;
                    data.contactFullName = e.target.value
                }
                this.setState({fields});
            }
        );
    }

    handleChangeContactEmail(e, oldData, index) {
        let fields = this.state.fields;
        let errors = {};
        this.state.contacts.map((data, index1) => {
                if (oldData === data.email && index === index1) {
                    fields["email"] = e.target.value;
                    data.email = e.target.value
                }
            }
        );
        this.setState({errors: errors});
        this.setState({fields});
    }

    handleChangeContactPhone(e, oldData, index) {
        this.state.contacts.map((data, index1) => {
                if (oldData === data.phone && index === index1) {
                    data.phone = e.target.value
                }
            }
        );
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        //projectName
        if (!fields["projectName"]) {
            formIsValid = false;
            errors["projectName"] = "project name cannot be empty";
        }

        //contactFullName
        if (!fields["contactFullName"]) {
            formIsValid = false;
            errors["contactFullName"] = "contact name cannot be empty";
        }

        //status
        if (!fields["status"]) {
            formIsValid = false;
            errors["status"] = " choose status";
        }

        //Email
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "email cannot be empty";
        }

        if (typeof fields["email"] !== "undefined" && fields["email"] !== "") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "email is not valid";
            }
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    render() {
        return (
            <div className="parent">
                <h3 className="projects-list">{this.state.title}</h3>
                <h4 className="required">* Required Fields</h4>
                <div className="content_edit">
                    <h3 className="title_text">1. General Information</h3>
                    <div className="blackLine"/>
                    <div className="field_title">
                        <p className="field_number">1.1</p>
                        <p className="second_text">Project Title</p>
                        <p className="third_text">*</p>
                    </div>
                    <form className="project_name"> required
                        <input onChange={(e) => this.handleChangeProjectName(e)} type="text" name="projectName"
                               id="projectNameId" ref="projectName" defaultValue={this.state.projectName} size="180"
                               placeholder={this.state.errors["projectName"]}/>
                    </form>
                    <div className="field_title">
                        <p className="field_number">1.2</p>
                        <p className="second_text">Project Status</p>
                        <p className="third_text">*</p>
                    </div>
                    <select name="status" className="status_select" onChange={(e) => this.handleChangeStatus(e)}>
                        <option value="">{this.state.status}</option>
                        <option value="new">New</option>
                        <option value="inProgress">In progress</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    <span className="error_input">{this.state.errors["status"]}</span>
                    <div className="field_title">
                        <p className="field_number">1.3</p>
                        <p className="second_text">Project Contacts</p>
                        <p className="third_text_1_3">(Please specify all contacts for this project from all the
                            participating organizations)</p>
                    </div>
                    <div className="edit_table-container">
                        <Table className="contacts_table">
                            <thead>
                            <tr>
                                <th width="30"/>
                                <th>
                                    <span>Contact <span className="red">*</span></span>
                                </th>
                                <th>
                                    <span>Email <span className="red">*</span></span>
                                </th>
                                <th>
                                    <span>Phone</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.contacts.map((data, index) => (
                                <tr>
                                    <td width="30" height="30">
                                        <img src={img} onClick={() => this.imageClick(data.contactId)} width="25"
                                             height="25" alt=""/>
                                    </td>
                                    <td>
                                        <form>
                                            <input
                                                onChange={(e) => this.handleChangeContactName(e, this.state.contacts[index].contactFullName, index)}
                                                id="contactFullNameId" type="text"
                                                placeholder={this.state.errors["contactFullName"]}
                                                name="fullName" defaultValue={data.contactFullName} size="60"/>
                                        </form>
                                    </td>
                                    <td>
                                        <form>
                                            <input
                                                onChange={(e) => this.handleChangeContactEmail(e, this.state.contacts[index].email, index)}
                                                type="text" name="email" defaultValue={data.email} size="30"/>
                                            <span className="error_input">{this.state.errors["email"]}</span>
                                        </form>
                                    </td>
                                    <td>
                                        <form>
                                            <input
                                                onChange={(e) => this.handleChangeContactPhone(e, this.state.contacts[index].phone, index)}
                                                type="text" name="phone" defaultValue={data.phone} size="30"/>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <button type="button" className="add_contact_btn" onClick={this.addContact}>Add</button>
                </div>
                <button className="save_and_cancel" onClick={this.saveAndClose}>Save and Close</button>
                <button className="cancel" onClick={this.clickCancel}>Cancel</button>
            </div>
        );
    }
}

export default EditProject;