import { useRoute } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Plus, Grid, List, Bell, Settings, Users, Folder, Layout, Clock, Star, MoreHorizontal, Filter, ChevronDown, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const MOCK_FILES = [
    { id: 1, title: "Payer Platform Architecture", date: "2 mins ago", author: "Antonio Jones", type: "System" },
    { id: 2, title: "Claims Processing Flow", date: "2 hours ago", author: "Sarah Chen", type: "Process" },
    { id: 3, title: "Identity Management", date: "yesterday", author: "Mike Ross", type: "Security" },
    { id: 4, title: "AWS Infrastructure", date: "2 days ago", author: "Antonio Jones", type: "Infra" },
    { id: 5, title: "Member Portal UX", date: "3 days ago", author: "Jessica Pearson", type: "Product" },
    { id: 6, title: "Legacy System Migration", date: "1 week ago", author: "Harvey Specter", type: "Strategy" },
];

const MOCK_TEAMS = ["Arkhitekton Core", "Payer Platform", "Clinical Data", "Member Experience"];

// --- Option 1: Figma Style (File & Community Hub) ---
function FigmaPrototype() {
    return (
        <div className="flex h-full bg-[#fcfcfc] text-slate-900 font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r bg-white p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white font-bold text-xs">A</div>
                    <span className="font-bold text-sm tracking-tight">Antonio's Team</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                        <Clock className="w-4 h-4" /> Recents
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
                        <Monitor className="w-4 h-4" /> Drafts
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
                        <Users className="w-4 h-4" /> Community
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="px-2 text-xs font-semibold text-slate-400 mb-2">TEAMS</div>
                    {MOCK_TEAMS.map((team, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
                            <div className={`w-2 h-2 rounded-sm ${['bg-purple-400', 'bg-green-400', 'bg-blue-400', 'bg-orange-400'][i % 4]}`} />
                            {team}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-xl font-medium mb-6">Recently viewed</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_FILES.map(file => (
                        <div key={file.id} className="group cursor-pointer">
                            <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded-lg mb-3 overflow-hidden relative group-hover:border-blue-400 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <Layout className="w-12 h-12" />
                                </div>
                                {/* Visual Preview Mockup */}
                                <div className="absolute inset-4 bg-white shadow-sm rounded border border-slate-100 opacity-80" />
                            </div>
                            <div className="px-1">
                                <div className="font-medium text-sm text-slate-900 truncate">{file.title}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{file.date}</div>
                            </div>
                        </div>
                    ))}
                    {/* New File Card */}
                    <div className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-lg aspect-[4/3] flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/10 transition-colors">
                        <Plus className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="text-sm font-medium text-slate-600">New Design File</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Option 2: Mural Style (Infinite Start) ---
function MuralPrototype() {
    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] text-slate-800 font-sans">
            {/* Header */}
            <div className="h-16 border-b flex items-center px-6 bg-white justify-between">
                <div className="flex items-center gap-8">
                    <div className="text-lg font-bold tracking-tight text-pink-600">Arkhitekton</div>
                    <div className="flex gap-4 text-sm font-medium text-slate-600">
                        <span className="text-slate-900">Home</span>
                        <span className="hover:text-slate-900 cursor-pointer">Learning</span>
                        <span className="hover:text-slate-900 cursor-pointer">Templates</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pink-100" placeholder="Search murals..." />
                    </div>
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-md">+ New mural</Button>
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                {/* Welcome Hero */}
                <div className="mb-12">
                    <h1 className="text-3xl font-light mb-2">Good morning, Antonio</h1>
                    <p className="text-slate-500">Ready to solve the next big problem?</p>
                </div>

                {/* Templates Row */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Get ideas and strategies for your role</h2>
                        <span className="text-sm text-pink-600 cursor-pointer hover:underline">View all templates</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {[
                            { color: 'bg-yellow-100', label: 'Engineering', icon: '🛠️' },
                            { color: 'bg-green-100', label: 'Strategy', icon: '🎯' },
                            { color: 'bg-purple-100', label: 'Design', icon: '🎨' },
                            { color: 'bg-orange-100', label: 'Product', icon: '📦' },
                            { color: 'bg-blue-100', label: 'Research', icon: '🔬' }
                        ].map((t, i) => (
                            <div key={i} className={`${t.color} h-32 w-48 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow shrink-0`}>
                                <span className="text-2xl">{t.icon}</span>
                                <span className="font-semibold text-slate-800">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recents List */}
                <div>
                    <h2 className="text-lg font-medium mb-4">Recently opened murals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_FILES.slice(0, 3).map(file => (
                            <div key={file.id} className="bg-white border rounded-lg p-4 flex items-center gap-4 hover:shadow-sm cursor-pointer transition-shadow">
                                <div className="w-16 h-12 bg-slate-100 rounded border border-slate-200"></div>
                                <div>
                                    <div className="font-medium text-sm">{file.title}</div>
                                    <div className="text-xs text-slate-500">Edited {file.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Option 3: Miro Style (Workspace Commander) ---
function MiroPrototype() {
    return (
        <div className="flex h-full bg-white text-slate-900 font-sans">
            {/* Far Left: Teams/Spaces Nav */}
            <div className="w-16 bg-[#050038] flex flex-col items-center py-6 gap-4 shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-white/50">A</div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-white/20">P</div>
                <div className="w-8 h-0.5 bg-white/20 my-2"></div>
                <div className="w-10 h-10 bg-transparent border-2 border-white/30 text-white/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-white hover:text-white transition-colors">
                    <Plus className="w-6 h-6" />
                </div>
            </div>

            {/* Middle: Project Tree */}
            <div className="w-64 border-r bg-gray-50/50 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-slate-800">Arkhitekton</span>
                    <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>

                <div className="space-y-1 mb-8">
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                        <Layout className="w-4 h-4" /> All boards
                    </div>
                    <div className="text-slate-600 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-slate-100 cursor-pointer">
                        <Star className="w-4 h-4" /> Starred
                    </div>
                </div>

                <div className="flex items-center justify-between px-3 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Projects</span>
                    <Plus className="w-3 h-3 text-slate-400 cursor-pointer" />
                </div>
                <div className="space-y-0.5">
                    {MOCK_TEAMS.map((team, i) => (
                        <div key={i} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer flex items-center gap-2">
                            <Folder className="w-4 h-4 text-slate-400" /> {team}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Board Grid */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="pl-10 pr-4 py-2 border rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search boards..." />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">Explore templates</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">+ New board</Button>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="font-bold text-lg mb-4">Recommended templates</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {['Mind map', 'Kanban', 'Flowchart', 'Service Blueprint'].map((t, i) => (
                            <div key={i} className="border rounded-md p-4 hover:shadow-md cursor-pointer transition-shadow h-24 flex items-center justify-center bg-white text-sm font-medium text-slate-600">
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Boards in this team</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-900">Last opened</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {MOCK_FILES.map(file => (
                            <div key={file.id} className="flex items-center gap-4 p-3 border-b hover:bg-slate-50 cursor-pointer group">
                                <div className="w-10 h-8 bg-yellow-100 rounded border border-yellow-200"></div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-slate-900">{file.title}</div>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>Modified by {file.author}</span>
                                        <span>•</span>
                                        <span>{file.date}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100">
                                    <Button variant="ghost" size="sm">Open</Button>
                                    <Button variant="ghost" size="sm">...</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Option 4: Enterprise (Task Based) ---
function EnterprisePrototype() {
    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans">
            <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
                <div className="font-bold text-lg flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded"></div>
                    ARKHITEKTON
                </div>
                <div className="flex items-center gap-4">
                    {['Dashboard', 'Governance', 'Catalog', 'Reports'].map(item => (
                        <span key={item} className={`text-sm font-medium cursor-pointer ${item === 'Dashboard' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>{item}</span>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                    <Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarFallback className="bg-slate-200 text-slate-700">AJ</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
                {/* Left Col: Main Work */}
                <div className="col-span-8 flex flex-col gap-6">
                    {/* Hero Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardTitle className="text-sm font-medium text-slate-500 p-4 pb-1">My Active Models</CardTitle>
                            <CardContent className="text-2xl font-bold p-4 pt-0">12</CardContent>
                        </Card>
                        <Card>
                            <CardTitle className="text-sm font-medium text-slate-500 p-4 pb-1">Pending Reviews</CardTitle>
                            <CardContent className="text-2xl font-bold p-4 pt-0 text-orange-600">3</CardContent>
                        </Card>
                        <Card>
                            <CardTitle className="text-sm font-medium text-slate-500 p-4 pb-1">Policy Violations</CardTitle>
                            <CardContent className="text-2xl font-bold p-4 pt-0 text-red-600">1</CardContent>
                        </Card>
                    </div>

                    <Card className="flex-1">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Recent-Activity</CardTitle>
                                <Button size="sm" variant="outline">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {MOCK_FILES.map(file => (
                                <div key={file.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <Layout className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{file.title}</div>
                                            <div className="text-xs text-slate-500">Updated {file.date} by {file.author}</div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs font-normal">{file.type}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Tasks & Feed */}
                <div className="col-span-4 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { title: "Approve PCI Data Model", due: "Today", tag: "Governance" },
                                { title: "Review AWS Migration", due: "Tomorrow", tag: "Design" },
                                { title: "Update Team Permissions", due: "Dec 12", tag: "Admin" }
                            ].map((task, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1" />
                                    <div>
                                        <div className="text-sm font-medium">{task.title}</div>
                                        <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                            <span className="text-orange-600">{task.due}</span>
                                            <span>•</span>
                                            <span>{task.tag}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-white">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">New Model</Button>
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">Scan Cloud</Button>
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">Run Report</Button>
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">Invite User</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// --- Option 5: Hybrid (Visual Curator) ---
function HybridPrototype() {
    return (
        <div className="flex flex-col h-full bg-[#f9f9fa] text-slate-900 font-sans">
            {/* Hero Header */}
            <div className="bg-white border-b pb-8 pt-6 px-8 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-200"></div>
                            Arkhitekton
                        </div>
                        <Avatar className="w-9 h-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8">
                        <h1 className="text-4xl font-semibold mb-6 tracking-tight text-slate-800">What are you building today?</h1>
                        <div className="relative w-full max-w-2xl group">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-white shadow-xl shadow-slate-200/60 rounded-full h-14 flex items-center px-6 border border-slate-100 ring-1 ring-slate-50 transition-shadow group-hover:shadow-2xl group-hover:shadow-indigo-200/40">
                                <Search className="w-5 h-5 text-slate-400 mr-4" />
                                <input className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400" placeholder="Search diagrams, objects, or people..." />
                                <div className="flex gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest pl-4 border-l">
                                    <span>CMD</span><span>K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
                <div className="max-w-6xl mx-auto w-full">

                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Your Work</h2>
                        <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                            <div className="p-1.5 bg-slate-100 rounded text-slate-700 cursor-pointer shadow-sm"><Grid className="w-4 h-4" /></div>
                            <div className="p-1.5 text-slate-400 cursor-pointer hover:text-slate-600 ml-1"><List className="w-4 h-4" /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Create New Card */}
                        <div className="aspect-[16/10] rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-sm hover:shadow-md">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-indigo-500" />
                            </div>
                            <span className="font-medium text-slate-600 group-hover:text-indigo-600">Create new diagram</span>
                        </div>

                        {MOCK_FILES.map((file, i) => (
                            <div key={file.id} className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative mb-4 group-hover:shadow-xl group-hover:shadow-slate-200/80 group-hover:-translate-y-1 transition-all duration-300">
                                    {/* Decorative Gradients based on index */}
                                    <div className={`absolute inset-0 opacity-10 ${i % 3 === 0 ? 'bg-gradient-to-br from-blue-400 to-indigo-600' :
                                        i % 3 === 1 ? 'bg-gradient-to-br from-emerald-400 to-teal-600' :
                                            'bg-gradient-to-br from-orange-400 to-pink-600'
                                        }`}></div>

                                    {/* Content Mockup */}
                                    <div className="absolute inset-6 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm border border-slate-100/50 flex items-center justify-center">
                                        <Layout className="w-12 h-12 text-slate-300" />
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white">
                                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start justify-between px-1">
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">{file.title}</div>
                                        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${file.type === 'System' ? 'bg-blue-400' :
                                                file.type === 'Process' ? 'bg-green-400' :
                                                    'bg-slate-300'
                                                }`}></span>
                                            {file.type} • {file.date}
                                        </div>
                                    </div>
                                    <Avatar className="w-6 h-6 border ring-1 ring-white">
                                        <AvatarFallback className="text-[10px]">AJ</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


// --- Option 6: The Architect's IDE (VS Code Style) ---
function IdePrototype() {
    return (
        <div className="flex h-full bg-[#1e1e1e] text-gray-300 font-sans">
            {/* Activity Bar */}
            <div className="w-12 bg-[#2d2d2d] flex flex-col items-center py-4 gap-4 shrink-0 border-r border-[#1e1e1e]">
                <div className="p-2 text-white border-l-2 border-white"><Folder className="w-6 h-6" /></div>
                <div className="p-2 text-gray-500 hover:text-white cursor-pointer"><Search className="w-6 h-6" /></div>
                <div className="p-2 text-gray-500 hover:text-white cursor-pointer"><Grid className="w-6 h-6" /></div>
                <div className="p-2 text-gray-500 hover:text-white cursor-pointer"><Users className="w-6 h-6" /></div>
                <div className="mt-auto p-2 text-gray-500 hover:text-white cursor-pointer"><Settings className="w-6 h-6" /></div>
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
                <div className="h-9 px-4 flex items-center text-xs font-bold uppercase tracking-wider text-gray-400">Explorer</div>
                <div className="flex-1 overflow-y-auto">
                    <div className="px-2 py-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-300 mb-1 cursor-pointer">
                            <ChevronDown className="w-4 h-4" /> ARKHITEKTON-CORE
                        </div>
                        <div className="pl-4 space-y-0.5">
                            {['models', 'diagrams', 'docs', 'src'].map(folder => (
                                <div key={folder} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white cursor-pointer py-0.5 hover:bg-[#2a2d2e] px-1 rounded">
                                    <ChevronDown className="w-3 h-3 text-gray-500" /> <Folder className="w-3 h-3 text-blue-400" /> {folder}
                                </div>
                            ))}
                            {MOCK_FILES.map(file => (
                                <div key={file.id} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white cursor-pointer py-0.5 hover:bg-[#2a2d2e] px-1 rounded pl-8">
                                    <Layout className="w-3 h-3 text-yellow-400" /> {file.title.replace(/\s+/g, '_').toLowerCase()}.arch
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                {/* Tabs */}
                <div className="h-9 bg-[#252526] flex items-center overflow-x-auto">
                    <div className="h-full bg-[#1e1e1e] flex items-center px-3 gap-2 text-sm text-white border-t border-blue-500 min-w-[150px]">
                        <Layout className="w-3 h-3 text-yellow-400" /> payer_platform.arch <span className="ml-auto text-gray-500 hover:text-white cursor-pointer">×</span>
                    </div>
                    <div className="h-full flex items-center px-3 gap-2 text-sm text-gray-400 hover:bg-[#2d2d2d] cursor-pointer min-w-[150px] border-r border-[#1e1e1e]">
                        <Layout className="w-3 h-3 text-yellow-400" /> identity_mgmt.arch <span className="ml-auto text-gray-500 hover:text-white cursor-pointer">×</span>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="h-6 flex items-center px-4 text-xs text-gray-500 gap-1 bg-[#1e1e1e] shadow-sm">
                    arkhitekton-core <span className="mx-0.5">›</span> diagrams <span className="mx-0.5">›</span> payer_platform.arch
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative bg-[#1e1e1e] p-8 overflow-hidden grid place-items-center">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="text-center">
                        <div className="text-2xl font-light text-gray-500 mb-4">No Editor Selected</div>
                        <div className="text-sm text-gray-600">Use <span className="bg-[#2d2d2d] px-1 py-0.5 rounded text-gray-400">Cmd+P</span> to quick open a file</div>
                    </div>
                </div>

                {/* Bottom Panel */}
                <div className="h-32 bg-[#252526] border-t border-[#1e1e1e] flex flex-col">
                    <div className="flex items-center gap-6 px-4 py-1.5 text-xs font-medium text-gray-400 border-b border-[#1e1e1e]">
                        <span className="text-white border-b border-white pb-1">PROBLEMS</span>
                        <span className="hover:text-white cursor-pointer pb-1">OUTPUT</span>
                        <span className="hover:text-white cursor-pointer pb-1">TERMINAL</span>
                        <span className="hover:text-white cursor-pointer pb-1">CONSOLE</span>
                    </div>
                    <div className="flex-1 p-2 font-mono text-xs text-gray-400 overflow-y-auto">
                        <div>[Info] Arkhitekton Language Server initialized</div>
                        <div>[Info] Loaded 6 models in 240ms</div>
                        <div>[Warn] Deprecated property 'legacy_mode' in identity_mgmt.arch:12</div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between shrink-0">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="font-bold">⊗</span> 0</span>
                    <span className="flex items-center gap-1"><span className="font-bold">⚠</span> 1</span>
                </div>
                <div className="flex gap-4">
                    <span>Ln 12, Col 43</span>
                    <span>UTF-8</span>
                    <span>ArchScript</span>
                </div>
            </div>
        </div>
    );
}

// --- Main Wrapper ---
export default function DesignOptionPrototypePage() {
    const [, params] = useRoute("/design-options/:id/prototype/:protoId");
    const protoId = params?.protoId;

    const renderPrototype = () => {
        switch (protoId) {
            case "ARKDL-00001": return <FigmaPrototype />;
            case "ARKDL-00002": return <MuralPrototype />;
            case "ARKDL-00003": return <MiroPrototype />;
            case "ARKDL-00004": return <EnterprisePrototype />;
            case "ARKDL-00005": return <HybridPrototype />;
            case "ARKDL-00006": return <IdePrototype />;
            default: return <div className="p-8">Prototype not found: {protoId}</div>;
        }
    };

    return (
        <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
            {/* Prototype Controls Header */}
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-300 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-white/10"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Options
                    </Button>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <span className="text-sm font-medium text-white">
                        Prototype Preview: <span className="text-slate-400">{protoId}</span>
                    </span>
                </div>
                <div className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/50">
                    Interactive Mockup
                </div>
            </div>

            {/* Prototype Viewport */}
            <div className="flex-1 relative bg-white overflow-hidden">
                {renderPrototype()}
            </div>
        </div>
    );
}
