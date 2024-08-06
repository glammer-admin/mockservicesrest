import { getUsers, createUser, updateUser, deleteUser, getUserByNameOrEmail } from "./in-memory-db";
import { parseFormData } from "./utils";

export async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    // Route: GET /users
    if (pathname === "/users" && method === "GET") {
        try {
            const name = url.searchParams.get("name") || "";
            const email = url.searchParams.get("email") || "";

            if (name || email) {
                const user = getUserByNameOrEmail(name, email);
                if (user) {
                    return new Response(JSON.stringify(user), {
                        headers: { "Content-Type": "application/json" },
                    });
                }
                return new Response("NOT FOUND", {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                });
            }

            const users = getUsers();
            return new Response(JSON.stringify(users), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: (error as Error).message }), {
                headers: { "Content-Type": "application/json" },
                status: 500,
            });
        }
    }

    // Route: POST /users
    if (pathname === "/users" && method === "POST") {
        try {
            // Read form data as text
            const formData = await req.text();
            const data = parseFormData(formData);
            const { name, email } = data;
            createUser(name, email);
            return new Response(JSON.stringify({ message: "User created" }), {
                headers: { "Content-Type": "application/json" },
                status: 201,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: (error as Error).message }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }
    }

    // Route: PUT /users/:id
    if (pathname.startsWith("/users/") && method === "PUT") {
        try {
            const id = parseInt(pathname.split("/")[2]);
            const data = await req.json();
            const { name, email } = data;
            updateUser(id, name, email);
            return new Response(JSON.stringify({ message: "User updated" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: (error as Error).message }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }
    }

    // Route: DELETE /users/:id
    if (pathname.startsWith("/users/") && method === "DELETE") {
        try {
            const id = parseInt(pathname.split("/")[2]);
            deleteUser(id);
            return new Response(JSON.stringify({ message: "User deleted" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: (error as Error).message }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }
    }

    return new Response("Not Found", { status: 404 });
}
