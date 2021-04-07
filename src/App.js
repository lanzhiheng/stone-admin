import { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import './App.css';
import buildGraphQLProvider from 'ra-data-graphql';
import buildQuery from './buildQuery'; // see Specify your queries and mutations section below
import { PostList, PostEdit } from './posts';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000/graphql',
  cache: new InMemoryCache()
});

class App extends Component {
  constructor() {
    super();
    this.state = { dataProvider: null };
  }
  componentDidMount() {
    buildGraphQLProvider({
      client,
      buildQuery,
      introspection: {
        include: ['post', 'category'],
      }
    })
      .then(dataProvider => {
        this.setState({ dataProvider })
      });
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin dataProvider={dataProvider}>
        <Resource name="Post" list={PostList} edit={PostEdit}  />
      </Admin>
    );
  }
}

export default App;
