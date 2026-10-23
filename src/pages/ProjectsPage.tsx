import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  X,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatShortDate } from '../lib/dates';
import type { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, toggleProjectTask, updateProjectStatus, deleteProject } = useData();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Project['priority']>('high');
  const [targetDate, setTargetDate] = useState('');
  const [tasksText, setTasksText] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.status === selectedFilter;
  });

  const totalProjects = projects.length;
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;

  let totalTasks = 0;
  let completedTasks = 0;
  projects.forEach((p) => {
    p.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  const overallHealth = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialTasks = tasksText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    await addProject(title.trim(), description.trim(), priority, targetDate || undefined, initialTasks);

    setTitle('');
    setDescription('');
    setPriority('high');
    setTargetDate('');
    setTasksText('');
    setIsCreating(false);
  };

  const priorityStyles = {
    critical: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    medium: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    low: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Strategic Initiatives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Executive</span>
            <span className="text-gold-gradient">Projects</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage high-leverage business and personal initiatives connected to your daily command center.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* KPI Stats Banner matching luxury dark aesthetic */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-ceo rounded-xl p-4 border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400">Total Initiatives</div>
          <div className="text-2xl font-bold text-slate-100 font-sans">{totalProjects}</div>
          <p className="text-[10px] text-slate-500">Active scope</p>
        </div>

        <div className="card-ceo rounded-xl p-4 border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono uppercase text-amber-400">In Execution</div>
          <div className="text-2xl font-bold text-amber-300 font-sans">{activeCount}</div>
          <p className="text-[10px] text-slate-500">Actively progressing</p>
        </div>

        <div className="card-ceo rounded-xl p-4 border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono uppercase text-emerald-400">Milestones Done</div>
          <div className="text-2xl font-bold text-emerald-300 font-sans">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-[10px] text-slate-500">Sub-tasks completed</p>
        </div>

        <div className="card-ceo rounded-xl p-4 border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono uppercase text-sky-400">Execution Velocity</div>
          <div className="text-2xl font-bold text-sky-300 font-sans">{overallHealth}%</div>
          <p className="text-[10px] text-slate-500">On-track index</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        {['all', 'active', 'planning', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-3.5 py-1.5 text-xs rounded-lg capitalize font-medium transition cursor-pointer ${
              selectedFilter === tab
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold shadow-sm'
                : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const tasksCount = project.tasks.length;
          const doneTasksCount = project.tasks.filter((t) => t.completed).length;
          const progress = tasksCount > 0 ? Math.round((doneTasksCount / tasksCount) * 100) : 0;

          return (
            <div
              key={project.id}
              className="card-ceo rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all duration-200 shadow-xl"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${
                      priorityStyles[project.priority]
                    }`}
                  >
                    {project.priority} priority
                  </span>

                  <div className="flex items-center gap-2">
                    {project.target_date && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {formatShortDate(project.target_date)}
                      </span>
                    )}

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-100 tracking-tight leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Milestones progress</span>
                    <span className="text-slate-200 font-semibold">
                      {doneTasksCount}/{tasksCount} ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Task Checklist */}
                {tasksCount > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.05] space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Key Milestones
                    </span>
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleProjectTask(project.id, task.id)}
                        className={`p-2 rounded-lg text-xs flex items-center gap-2.5 cursor-pointer border transition select-none ${
                          task.completed
                            ? 'bg-emerald-500/[0.05] border-emerald-500/20 text-slate-400 line-through'
                            : 'bg-white/[0.02] border-white/[0.04] text-slate-200 hover:border-white/[0.1]'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : 'border-white/[0.2] bg-white/[0.02]'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                        <span className="truncate flex-1">{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Switcher Footer */}
              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Status:</span>
                <div className="flex items-center gap-1">
                  {(['active', 'planning', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateProjectStatus(project.id, st)}
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded transition ${
                        project.status === st
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleCreateProject}
            className="card-ceo rounded-2xl max-w-lg w-full p-6 border border-amber-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Launch New Executive Project</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Cloud Telemetry & Automated Scaling"
                className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Strategic Objective</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why this project matters and what success looks like..."
                className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Project['priority'])}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-200 focus:border-amber-500"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Horizon</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-200 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Milestones (One per line)
              </label>
              <textarea
                rows={3}
                value={tasksText}
                onChange={(e) => setTasksText(e.target.value)}
                placeholder="Draft architecture spec&#10;Audit latency bottlenecks&#10;Ship staging pilot"
                className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition cursor-pointer shadow-md"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
