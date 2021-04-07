// in src/posts.js
import * as React from "react";
import { SimpleForm, List, Datagrid, TextField, Edit, TextInput } from 'react-admin';

export const PostEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput multiline source="body" />
      <TextInput source="slug" />
    </SimpleForm>
  </Edit>
);

export const PostList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
    </Datagrid>
  </List>
);
