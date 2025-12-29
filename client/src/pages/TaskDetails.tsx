import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ArrowLeft, CheckCircle2, Clock, Circle, Calendar, FileText, Tag, Edit } from 'lucide-react';
import { useToast } from '../components/Toast';

type Task = {
    id: number;
    title: string;
    description?: string;
    status?: string;
    createdAt?: string;
    deadline?: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TaskDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '', status: 'todo' });
    const { addToast } = useToast();

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) {
                setError('Invalid task ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/tasks/${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Task not found');
                    }
                    throw new Error(`Failed to fetch task: ${res.status}`);
                }
                const data = await res.json();
                setTask(data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch task';
                setError(message);
                addToast(message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, addToast]);

    const getStatusBadge = (status?: string) => {
        const s = (status || 'todo').toLowerCase();
        if (s === 'completed' || s === 'done') {
            return (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30 text-sm px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Completed
                </Badge>
            );
        }
        if (s === 'in-progress' || s === 'progress') {
            return (
                <Badge variant="default" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-sm px-3 py-1">
                    <Clock className="h-4 w-4 mr-1.5" />
                    In Progress
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-sm px-3 py-1">
                <Circle className="h-4 w-4 mr-1.5" />
                To Do
            </Badge>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not available';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const handleEdit = () => {
        if (!task) return;
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description || '',
            status: task.status || 'todo'
        });
    };

    const handleEditCancel = () => {
        setEditingTask(null);
        setEditFormData({ title: '', description: '', status: 'todo' });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask || !editFormData.title.trim()) {
            addToast('Please enter a task title', 'error');
            return;
        }

        try {
            const payload = {
                title: editFormData.title.trim(),
                description: editFormData.description.trim(),
                status: editFormData.status
            };
            const res = await fetch(`${API_URL}/tasks/${editingTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to update task');
            addToast('Task updated', 'success');
            setEditingTask(null);
            setEditFormData({ title: '', description: '', status: 'todo' });
            // Refresh task data
            const fetchTask = async () => {
                if (!id) return;
                try {
                    const res = await fetch(`${API_URL}/tasks/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setTask(data);
                    }
                } catch (err) {
                    console.error('Failed to refresh task', err);
                }
            };
            fetchTask();
        } catch (err) {
            console.error(err);
            addToast('Failed to update task', 'error');
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in space-y-6 py-6 max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
                <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading task details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="animate-fade-in space-y-6 py-6 max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="mb-4 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>
                <Card className="border-destructive/50 bg-destructive/10">
                    <CardContent className="pt-12 pb-12 text-center">
                        <p className="text-destructive text-lg font-semibold mb-2">Error</p>
                        <p className="text-muted-foreground">{error || 'Task not found'}</p>
                        <div className="mt-6 flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                            <Link to="/dashboard">
                                <Button>Go to Dashboard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6 py-6 max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-4 gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-2xl sm:text-3xl mb-2">{task.title}</CardTitle>
                            <div className="flex items-center gap-3 mt-3">
                                {getStatusBadge(task.status)}
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2" onClick={handleEdit}>
                            <Edit className="h-4 w-4" />
                            Edit Task
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {task.description && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                Description
                            </div>
                            <p className="text-base sm:text-lg leading-relaxed bg-muted/50 p-4 rounded-lg border">
                                {task.description}
                            </p>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                Status
                            </div>
                            <div>{getStatusBadge(task.status)}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Created At
                            </div>
                            <p className="text-base font-medium">
                                {formatDate(task.createdAt)}
                            </p>
                        </div>

                        {task.deadline && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Deadline
                                </div>
                                <p className="text-base font-medium">
                                    {formatDate(task.deadline)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Link to="/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Link to="/add-task" className="flex-1">
                            <Button className="w-full gap-2">
                                Add New Task
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={Boolean(editingTask)} onOpenChange={(open) => !open && handleEditCancel()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit Task
                        </DialogTitle>
                        <DialogDescription>
                            Update the task details below
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-title" className="text-sm font-medium">Title *</label>
                            <Input
                                id="edit-title"
                                placeholder="Task title"
                                value={editFormData.title}
                                onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="edit-description"
                                placeholder="Task description"
                                rows={4}
                                value={editFormData.description}
                                onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                className="w-full resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                            <Select
                                id="edit-status"
                                value={editFormData.status}
                                onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                                className="w-full"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleEditCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" className="gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Update Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}








