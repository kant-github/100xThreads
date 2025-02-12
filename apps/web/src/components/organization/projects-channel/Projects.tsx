import { useState } from 'react';
import { Plus, ChevronLeft } from 'lucide-react';
import CreateProjectsForm from '@/components/form/CreateProjectsForm';

// Dummy data
const dummyProjects = [
    {
        id: "1",
        title: "Website Redesign",
        description: "Complete overhaul of company website",
        created_at: new Date(),
        tasks: [
            {
                id: "t1",
                title: "Design Homepage",
                status: "TODO",
                priority: "HIGH",
                description: "Create new homepage design",
                assignees: [{ id: 1, name: "John Doe", image: null }]
            },
            {
                id: "t2",
                title: "Implement Backend API",
                status: "IN_PROGRESS",
                priority: "NORMAL",
                description: "Set up new REST endpoints",
                assignees: [{ id: 2, name: "Jane Smith", image: null }]
            }
        ]
    },
    {
        id: "2",
        title: "Mobile App Development",
        description: "New iOS and Android app",
        created_at: new Date(),
        tasks: [
            {
                id: "t3",
                title: "User Authentication",
                status: "DONE",
                priority: "HIGH",
                description: "Implement OAuth flow",
                assignees: [{ id: 1, name: "John Doe", image: null }]
            }
        ]
    }
];

export default function () {
    const [selectedProject, setSelectedProject] = useState(null);
    const [createProjectsModal, setCreateProjectsModal] = useState<boolean>(false);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyProjects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-white dark:bg-neutral-700 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {project.tasks.length} tasks
                            </span>
                            <button type='button' className="text-blue-500 hover:text-blue-600">
                                View Tasks →
                            </button>
                        </div>
                    </div>
                ))}

                <button type='button' onClick={() => setCreateProjectsModal(true)} className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-600">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="ml-2 text-gray-600 dark:text-gray-300">New Project</span>
                </button>
            </div>
            {createProjectsModal && <CreateProjectsForm open={createProjectsModal} setOpen={setCreateProjectsModal} />}
        </>
    );
}