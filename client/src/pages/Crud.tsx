import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ListTodo } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Crud() {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const { addToast } = useToast();
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const location = useLocation();
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            addToast('Please enter a task title', 'error');
            return;
        }

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
            };

            if (isEdit && editId) {
                await fetch(`${API_URL}/tasks/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                addToast('Task updated', 'success');
            } else {
                // For new tasks set default status
                await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, status: 'todo' }),
                });
                addToast('Task added', 'success');
            }
            // Redirect to dashboard after successful create/update
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            addToast('Failed to save task', 'error');
        }
    };

    // Watch hash for edit mode: #edit-<id>
    useEffect(() => {
        const hash = location.hash || '';
        if (hash.startsWith('#edit-')) {
            const idStr = hash.replace('#edit-', '') || '';
            const id = Number(idStr);
            if (!isNaN(id) && id > 0) {
                setIsEdit(true);
                setEditId(id);
                // fetch task details
                (async () => {
                    try {
                        const res = await fetch(`${API_URL}/tasks/${id}`);
                        if (!res.ok) throw new Error('Failed to fetch task');
                        const data = await res.json();
                        setFormData({ title: data.title || '', description: data.description || '' });
                        // focus title
                        titleRef.current?.focus();
                    } catch (e) {
                        console.error(e);
                        addToast('Failed to load task for editing', 'error');
                        // fallback to add mode
                        setIsEdit(false);
                        setEditId(null);
                    }
                })();
                return;
            }
        }
        // Default to add mode when not editing
        setIsEdit(false);
        setEditId(null);
        setFormData({ title: '', description: '' });
    }, [location.hash]);

    return (
        <div className="animate-fade-in space-y-6 sm:space-y-8 py-4 sm:py-6 max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <ListTodo className="h-5 w-5 sm:h-6 sm:w-6" />
                    {isEdit ? 'Edit Task' : 'Add New Task'}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">{isEdit ? 'Update the task details below' : 'Create a new task to get started'}</p>
            </div>

            <Card id="add-form">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        Task Details
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {isEdit ? 'Make changes and save to update the task.' : 'Fill in the details to create a new task. You can manage and edit tasks from the dashboard.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title *</label>
                            <Input
                                id="title"
                                ref={titleRef}
                                placeholder="Enter task title"
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
                                rows={6}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full resize-none"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            New tasks will be set to "To Do" status. You can change the status and manage tasks from the dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button type="submit" className="flex-1 gap-2">
                                <Plus className="h-4 w-4" />
                                {isEdit ? 'Update Task' : 'Add Task'}
                            </Button>
                            <Link to="/dashboard" className="flex-1 sm:flex-none">
                                <Button type="button" variant="outline" className="w-full gap-2">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
