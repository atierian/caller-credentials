import {
  Authenticator,
  Button,
  Flex,
  Heading,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/api";
import { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "./App.css";
import { fetchAuthSession } from "aws-amplify/auth";

const client = generateClient<Schema>();

function App() {
  const [id, setId] = useState("");
  const [todoContent, setTodoContent] = useState("");

  const listTodos = async () => {
    const { data, errors } = await client.models.Todo.list();
    console.log(">> listTodos data:", data);
    console.log(">> listTodos errors:", errors);
  };

  const getTodo = async () => {
    const { data, errors } = await client.models.Todo.get({ id });
    console.log(">> getTodo data:", data);
    console.log(">> getTodo errors:", errors);
  };

  const createTodo = async () => {
    const session = await fetchAuthSession();
    const identityId = session.identityId!;
    const { data, errors } = await client.models.Todo.create({
      id: identityId,
      content: todoContent,
    });
    console.log(">> createTodo data:", data);
    console.log(">> createTodo errors:", errors);
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <View padding="2rem">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom="2rem"
          >
            <Heading level={1}>FAS</Heading>
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>

          <View width="100%">
            <Heading level={3}>Create Todo</Heading>
            <TextField
              label="Content"
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
            ></TextField>
            <Button onClick={createTodo}>Create Todo</Button>

            <Heading level={3}>List Todos</Heading>
            <Button onClick={listTodos}>List Todos</Button>

            <TextField
              label="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            ></TextField>
            <Button onClick={getTodo}>Get Todo</Button>
          </View>
        </View>
      )}
    </Authenticator>
  );
}

export default App;
