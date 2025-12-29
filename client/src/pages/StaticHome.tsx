import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Plus, RefreshCw, Target, Zap, ListTodo, Circle } from 'lucide-react';

type Task = { id: number; title: string; description?: string; status?: string };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StaticHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store', mode: 'cors' });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed' || (t.status || '').toLowerCase() === 'done').length;
  const inProgress = tasks.filter(t => (t.status || '').toLowerCase() === 'in-progress' || (t.status || '').toLowerCase() === 'progress').length;
  
  const recentTasks = tasks.slice(0, 5);
  
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
    <div className="animate-fade-in space-y-6 sm:space-y-8 md:space-y-10 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start lg:items-center">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome to TaskManager
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A modern, intuitive task management system designed to help you organize your work, 
              track progress, and stay productive. Built with simplicity and efficiency in mind.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                <Target className="h-4 w-4" />
                Open Dashboard
              </Button>
            </Link>
            <Link to="/add-task">
              <Button size="lg" variant="secondary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={fetchTasks}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 pt-4 sm:pt-5 md:pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Quick Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get started in seconds. Add tasks and track progress with an intuitive interface.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Real-time Sync</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your tasks are always up to date. Changes sync instantly across all views.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 pt-3 sm:pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  {inProgress}
                </div>
                <p className="text-sm text-muted-foreground mt-1">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  {completed}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle>Why TaskManager?</CardTitle>
            <CardDescription>
              Everything you need to stay organized and productive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Clean, Modern Interface</p>
                  <p className="text-sm text-muted-foreground">
                    Beautiful dark theme designed for focus and productivity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Simple Task Management</p>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, and organize tasks with ease
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Progress Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor your workflow with real-time status updates
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/add-task">
                <Button className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
            {error && (
              <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {tasks.length > 0 && (
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <ListTodo className="h-5 w-5 sm:h-6 sm:w-6" />
                Recent Tasks
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Your latest tasks at a glance</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {recentTasks.map(task => (
              <Card key={task.id} className="hover:border-primary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 flex-1">{task.title}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    )}
                    <div className="pt-2">
                      <Link to={`/task/${task.id}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
