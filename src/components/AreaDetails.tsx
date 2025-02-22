interface AreaDetailsProps {
  name: string;
  type: 'state' | 'district' | 'locality';
  statistics: {
    forestCover: number;
    barrenLand: number;
    agriculturalLand: number;
  };
  projects: Array<{
    id: string;
    name: string;
    status: string;
    treesPlanted: number;
  }>;
}

export function AreaDetails({ name, type, statistics, projects }: AreaDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{name}</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics.forestCover}%
          </div>
          <div className="text-sm text-gray-600">Forest Cover</div>
        </div>
        {/* ... other statistics ... */}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Active Projects</h4>
        {projects.map(project => (
          <div key={project.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">{project.name}</h5>
                <p className="text-sm text-gray-600">
                  {project.treesPlanted} trees planted
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 