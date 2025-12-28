import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, X, CheckCircle2, Clock, Circle, ListTodo } from 'lucide-react';

type Task = {
    id: number;
    title: string;
    description: string;
    status?: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Crud() {
    const [items, setItems] = useState<Task[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const { addToast } = useToast();

    const titleRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`${API_URL}/tasks`);
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                addToast('Failed to fetch tasks', 'error');
            }
        };
        
        loadData();

        if (typeof window !== 'undefined') {
            if (window.location.hash === '#add') {
                setEditingId(null);
                setFormData({ title: '', description: '', status: 'todo' });
                setTimeout(() => {
                    titleRef.current?.focus();
                    document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
            } else if (window.location.hash.startsWith('#edit-')) {
                const idStr = window.location.hash.replace('#edit-', '');
                const id = Number(idStr);
                if (id > 0) {
                    (async () => {
                        try {
                            const res = await fetch(`${API_URL}/tasks/${id}`);
                            if (res.ok) {
                                const t = await res.json();
                                setEditingId(t.id);
                                setFormData({ title: t.title || '', description: t.description || '', status: t.status || 'todo' });
                                setTimeout(() => {
                                    titleRef.current?.focus();
                                    document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' });
                                }, 80);
                            }
                        } catch (err) {
                            console.error('Failed to load task for edit', err);
                        }
                    })();
                }
            }
        }
    }, [addToast]);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_URL}/tasks`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            addToast('Failed to fetch tasks', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            addToast('Please enter a task title', 'error');
            return;
        }

        try {
            const payload: { title: string; description: string; status: string } = { 
                title: formData.title.trim(), 
                description: formData.description.trim(), 
                status: editingId ? formData.status : 'todo' // Always set to 'todo' for new tasks
            };
            if (editingId) {
                await fetch(`${API_URL}/tasks/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                addToast('Task updated', 'success');
            } else {
                await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                addToast('Task added', 'success');
            }
            setEditingId(null);
            setFormData({ title: '', description: '', status: 'todo' });
            fetchItems();
        } catch (err) {
            console.error(err);
            addToast('Failed to save task', 'error');
        }
    };

    const handleEdit = (item: Task) => {
        setEditingId(item.id);
        setFormData({ 
            title: item.title, 
            description: item.description || '', 
            status: item.status || 'todo' 
        });
        setTimeout(() => {
            titleRef.current?.focus();
            document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };


    const handleDelete = (id: number, title?: string) => {
        setConfirmId(id);
        setConfirmTitle(title || 'this task');
    };

    const handleDeleteConfirmed = async () => {
        if (!confirmId) return;
        try {
            await fetch(`${API_URL}/tasks/${confirmId}`, { method: 'DELETE' });
            addToast('Task deleted', 'success');
            fetchItems();
        } catch (err) {
            console.error(err);
            addToast('Failed to delete task', 'error');
        } finally {
            setConfirmId(null);
            setConfirmTitle('');
        }
    };

    const getStatusBadge = (status?: string) => {
        const s = (status || 'todo').toLowerCase();
        if (s === 'completed' || s === 'done') {
            return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
        }
        if (s === 'in-progress' || s === 'progress') {
            return <Badge variant="default" className="bg-orange-500/20 text-orange-400 border-orange-500/30"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
        }
        return <Badge variant="outline"><Circle className="h-3 w-3 mr-1" />To Do</Badge>;
    };

    return (
        <div className="animate-fade-in space-y-6 sm:space-y-8 py-4 sm:py-6 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <ListTodo className="h-5 w-5 sm:h-6 sm:w-6" />
                        Manage Tasks
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Create, edit, and organize your tasks</p>
                </div>
                <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold">{items.length}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Tasks</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <Card id="add-form" className="lg:sticky lg:top-6 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            {editingId ? (
                                <>
                                    <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Update Task
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Add New Task
                                </>
                            )}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {editingId ? 'Update the task details below' : 'Fill in the details to create a new task'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">Title *</label>
                                <Input
                                    id="title"
                                    ref={titleRef}
                                    placeholder="e.g. Prepare quarterly report"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">Description</label>
                                <Textarea
                                    id="description"
                                    placeholder="Add details about the task..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full resize-none"
                                />
                            </div>
                            {editingId && (
                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                                    <Select
                                        id="status"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </Select>
                                </div>
                            )}
                            {!editingId && (
                                <p className="text-xs text-muted-foreground">
                                    New tasks will be set to "To Do" status. You can change the status from the dashboard.
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button type="submit" className="flex-1 gap-2 w-full sm:w-auto">
                                    {editingId ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Update Task
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Add Task
                                        </>
                                    )}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => { 
                                            setEditingId(null); 
                                            setFormData({ title: '', description: '', status: 'todo' }); 
                                        }}
                                        className="gap-2 w-full sm:w-auto"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {items.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                                <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
                                <Link to="/crud#add">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Your First Task
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        items.map(item => (
                            <Card key={item.id} className="hover:border-primary/50 transition-all">
                                <CardContent className="pt-4 sm:pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 break-words">{item.title}</h3>
                                                    {item.description && (
                                                        <p className="text-sm sm:text-base text-muted-foreground break-words">{item.description}</p>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    {getStatusBadge(item.status)}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <Link to="/dashboard" className="flex-1 sm:flex-none min-w-[120px]">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2 w-full sm:w-auto"
                                                    >
                                                        Change Status
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(item)}
                                                    className="gap-2 flex-1 sm:flex-none"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sm:inline">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id, item.title)}
                                                    className="gap-2 flex-1 sm:flex-none"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sm:inline">Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={Boolean(confirmId)} onOpenChange={(open) => !open && setConfirmId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>"{confirmTitle}"</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirmed} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
