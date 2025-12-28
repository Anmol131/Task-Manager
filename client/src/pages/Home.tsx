import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Plus, Search, X, CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react';

type Task = {
    id: number;
    title: string;
    description?: string;
    status?: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    const updateStatus = async (task: Task, status: string) => {
        try {
            const payload: any = { title: task.title, description: task.description, status };
            const res = await fetch(`${API_URL}/tasks/${task.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            if (!res.ok) throw new Error('Failed');
            addToast('Status updated', 'success');
            fetchTasks();
        } catch (err) {
            console.error(err);
            addToast('Failed to update status', 'error');
        }
    };

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store', mode: 'cors' });
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Failed to fetch tasks', err);
            setError(err?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const total = tasks.length;
    const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'done' || (t.status || '').toLowerCase() === 'completed').length;
    const inProgress = tasks.filter(t => (t.status || '').toLowerCase() === 'in-progress' || (t.status || '').toLowerCase() === 'progress').length;
    const todo = total - completed - inProgress;
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const todoPct = total > 0 ? Math.max(0, 100 - completedPct - inProgressPct) : 0;

    const filtered = tasks.filter(t => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
    });

    const recent = tasks.slice(0, 5);

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
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl sm:text-3xl">Task Dashboard</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Organize your work, track progress, and stay focused
                            </CardDescription>
                        </div>
                        <div className="text-left sm:text-right space-y-2 w-full sm:w-auto">
                            <div className="text-2xl sm:text-3xl font-bold">{total}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Total Tasks</div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchTasks}
                                disabled={loading}
                                className="mt-2 gap-2 w-full sm:w-auto"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Refreshing…' : 'Refresh'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Link to="/crud" className="w-full sm:w-auto">
                            <Button variant="default" className="gap-2 w-full sm:w-auto">
                                <Plus className="h-4 w-4" />
                                Manage Tasks
                            </Button>
                        </Link>
                        <Link to="/crud#add" className="w-full sm:w-auto">
                            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                                <Plus className="h-4 w-4" />
                                Add Task
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
            </Card>

            {error && (
                <Card className="border-destructive/50 bg-destructive/10">
                    <CardContent className="pt-6">
                        <p className="text-destructive">Error: {error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                Overall Progress
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm sm:text-base">Track your task completion rate</CardDescription>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold">{completedPct}%</div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative h-6 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${completedPct}%` }}
                        />
                        <div 
                            className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${inProgressPct}%`, left: `${completedPct}%` }}
                        />
                        <div 
                            className="absolute left-0 top-0 h-full bg-muted-foreground/30 transition-all duration-500"
                            style={{ width: `${todoPct}%`, left: `${completedPct + inProgressPct}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-xl sm:text-2xl font-bold">{todo}</div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">To Do</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-xl sm:text-2xl font-bold text-orange-400">{inProgress}</div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">In Progress</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-xl sm:text-2xl font-bold text-green-400">{completed}</div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Completed</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="pl-10 text-sm sm:text-base"
                    />
                </div>
                {query && (
                    <Button variant="outline" onClick={() => setQuery('')} className="gap-2 shrink-0">
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Tasks</CardTitle>
                            <CardDescription>
                                {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'} found
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filtered.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p className="text-lg mb-2">No tasks found</p>
                                    <p className="text-sm">Try adjusting your search or add new tasks</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filtered.map(task => (
                                        <Card key={task.id} className="hover:border-primary/50 transition-colors">
                                            <CardContent className="pt-4 sm:pt-6">
                                                <div className="space-y-3">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                                        <div className="flex-1 space-y-2 min-w-0 w-full">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h4 className="font-semibold text-base sm:text-lg break-words">{task.title}</h4>
                                                                {getStatusBadge(task.status)}
                                                            </div>
                                                            {task.description && (
                                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                                                            )}
                                                        </div>
                                                        <Select
                                                            value={task.status || 'todo'}
                                                            onChange={e => updateStatus(task, e.target.value)}
                                                            className="w-full sm:w-40 shrink-0"
                                                        >
                                                            <option value="todo">To Do</option>
                                                            <option value="in-progress">In Progress</option>
                                                            <option value="completed">Completed</option>
                                                        </Select>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <Link to={`/task/${task.id}`} className="flex-1">
                                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:sticky lg:top-6 h-fit">
                    <CardHeader>
                        <CardTitle>Recent Tasks</CardTitle>
                        <CardDescription>Your latest activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recent.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No recent tasks</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recent.map(t => (
                                    <div key={t.id} className="p-3 rounded-lg border bg-card space-y-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{t.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{t.status || 'todo'}</p>
                                            </div>
                                        </div>
                                        <Link to={`/task/${t.id}`}>
                                            <Button variant="ghost" size="sm" className="w-full text-xs">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
