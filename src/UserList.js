import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Input, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';


const stringHandler = (string) => string.toLowerCase().replace(/ /g, '');
function matchingLetters(titleOfItem, valueOfSearch) {
    return stringHandler(titleOfItem).startsWith(stringHandler(valueOfSearch));
};

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            search: '',
            ascending: true,
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/users')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ users: data })
            });
    }

    async remove(id) {
        await fetch(`/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updateUsers = [...this.state.users].filter(i => i.id !== id);
            this.setState({ users: updateUsers });
        });
    }

    render() {
        const { cars, users, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const userListFilteredBySearch = users.filter((user) => matchingLetters(user.name, this.state.search));
        const userListSortedByAsceding = userListFilteredBySearch.sort((a, b) => this.state.ascending ? a.id - b.id : b.id - a.id)
        const userList = userListSortedByAsceding.map(user => (
            <tr key={user.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{user.id}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{user.name}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{<div> {user.cars.map(car => <div>{car.make}</div>)}</div>}</td>
                {/*<td style={{whiteSpace: 'nowrap'}}>{cars.numberplate} </td>*/}
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/users/" + user.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(user.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        ));


        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/users/new">Add User</Button>
                    </div>
                    <h3>Clients</h3>
                    <span style={{ display: 'flex' }}>
                        <Input style={{ maxWidth: '400px' }} value={this.search} onChange={(e) => this.setState({ search: e.target.value })} />
                        <span style={{ display: 'flex', alignItems: 'end', marginLeft: '40px' }}>
                            ascending
                        <span style={{ marginLeft: '5px' }} className='checkbox' onClick={() => this.setState({ ascending: !this.state.ascending })}>{this.state.ascending ? '✔' : null}</span>
                        </span>
                    </span>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="30%">Id</th>
                                <th width="30%">Name</th>
                                <th width="40%">Cars</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default UserList;