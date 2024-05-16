import type { MetaFunction } from "@remix-run/node";
import { electric, localDb } from "~/database/.client/electric";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import {
  type ClientActionFunctionArgs,
  Form,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { serverDb } from "~/database/.server/db";
import { useSyncExternalStore } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Electrizzle" }];
};

export async function clientLoader() {
  await electric.db.post.sync();

  const posts = await electric.db.post.findMany();

  console.log("electrified posts", posts);

  return { posts: posts.reverse() };
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function action() {
  const data = {
    title: `SERVER: ${faker.lorem.sentence(3)}`,
    creatorId: faker.string.uuid(),
    id: createId(),
  };

  console.log("create post from server", data);

  await serverDb.insert(serverDb.schema.post).values(data);

  return null;
}

export async function clientAction({
  params,
  serverAction,
}: ClientActionFunctionArgs) {
  if (params.target === "server") {
    return await serverAction();
  }

  const data = {
    title: `CLIENT-${params.target}: ${faker.lorem.sentence(3)}`,
    id: createId(),
  };

  console.log(`create post from client with ${params.target}`, data);

  if (params.target === "electric") {
    await electric.db.post.create({
      data: {
        ...data,
        creator_id: faker.string.uuid(),
      },
    });
  }

  if (params.target === "drizzle") {
    await localDb.insert(localDb.schema.post).values({
      ...data,
      creatorId: faker.string.uuid(),
    });
  }

  return null;
}

function onLocalDBChange(callback: () => void) {
  const unsub = electric.satellite.notifier.subscribeToDataChanges(callback);

  return () => {
    unsub();
  };
}

export default function Index() {
  const { revalidate } = useRevalidator();
  useSyncExternalStore(
    () => onLocalDBChange(revalidate),
    () => null,
    () => null
  );
  const { posts } = useLoaderData<typeof clientLoader>();

  return (
    <div>
      <h1>App is running</h1>
      <h2>See console for logs</h2>
      <Form method="post" action="/electric" navigate={false}>
        <button type="submit">Generate post from client with Electric</button>
      </Form>
      <Form method="post" action="/drizzle" navigate={false}>
        <button type="submit">Generate post from client with Drizzle</button>
      </Form>
      <Form method="post" action="/server" navigate={false}>
        <button type="submit">Generate post from server</button>
      </Form>
      <h3>Posts</h3>
      <div style={{ maxHeight: "500px", margin: "0 auto", overflowY: "auto" }}>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>
    </div>
  );
}
