import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
import { tasks } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Task Management Backend Running");
});

app.post("/tasks", async (req: Request, res: Response) => {
    try {
        const { title, description, status, deadline } = req.body;
        const values: any = { title, description, status };
        if (deadline) values.deadline = new Date(deadline);
        const newTask = await db.insert(tasks).values(values).returning();
        res.json(newTask[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.get("/tasks", async (req: Request, res: Response) => {
    try {
        const allTasks = await db.select().from(tasks);
        res.json(allTasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, Number(id))
        });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status, deadline } = req.body;
        const updateValues: any = { title, description, status };
        if (deadline === null) {
            updateValues.deadline = null;
        } else if (deadline !== undefined) {
            updateValues.deadline = new Date(deadline);
        }
        const updatedTask = await db.update(tasks)
            .set(updateValues)
            .where(eq(tasks.id, Number(id)))
            .returning();
        res.json(updatedTask[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(tasks).where(eq(tasks.id, Number(id)));
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
