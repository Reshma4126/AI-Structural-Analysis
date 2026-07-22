import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MomentDiagramChart from '../../components/charts/MomentDiagramChart';
import { currentUser, sampleBeamCalculations, initialProjects } from '../../services/mockData';

export default function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ACTIVE SESSION • {currentUser.company}
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-navy-800 tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}.
          </h1>
          <p className="text-xs lg:text-sm text-navy-500 mt-1">
            Integrated AI decision platform for structural optimization and AISC 360-16 LRFD checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="folder_open"
            onClick={() => navigate('/projects')}
          >
            Projects Portfolio
          </Button>
          <Button
            variant="primary"
            icon="add"
            onClick={() => navigate('/beam-design')}
          >
            New Calculation
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Overall Health Score"
          value="94"
          unit="/100"
          subtitle="All structural limits within code"
          icon="health_and_safety"
          statusColor="green"
          trend="+3% vs last build"
          trendType="positive"
        />
        <MetricCard
          title="Avg Weight Reduction"
          value="18.4%"
          subtitle="AI Optimized steel tonnage"
          icon="tips_and_updates"
          statusColor="cyan"
          badgeText="AI Recommendation"
        />
        <MetricCard
          title="Max Bending Moment"
          value="612.4"
          unit="kN·m"
          subtitle="Beam B-104 Transfer Girder"
          icon="architecture"
          statusColor="steel"
          trend="82.5% Capacity"
          trendType="neutral"
        />
        <MetricCard
          title="AISC 360-16 LRFD Check"
          value="PASSED"
          subtitle="Flexure, Shear & Deflection"
          icon="verified"
          statusColor="green"
          badgeText="1.48 Safety Factor"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Beam Calculation & Moment Diagram */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Calculation Panel */}
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-5">
            <div className="flex items-center justify-between border-b border-concrete-200 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyanAccent-600 bg-cyanAccent-50 px-2 py-0.5 rounded font-bold uppercase">
                  Active Optimization Unit
                </span>
                <h2 className="text-xl font-heading font-bold text-navy-800 mt-1">
                  {sampleBeamCalculations.name}
                </h2>
                <p className="text-xs text-navy-500 font-mono">
                  {sampleBeamCalculations.standard} • {sampleBeamCalculations.steelGrade}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="green" icon="check_circle">
                  {sampleBeamCalculations.structuralResults.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  icon="visibility"
                  onClick={() => navigate('/xai')}
                >
                  XAI Insights
                </Button>
              </div>
            </div>

            {/* Geometry & Load Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-concrete-50 rounded border border-concrete-200 font-mono text-xs">
              <div>
                <p className="text-navy-400 text-[10px]">SPAN LENGTH</p>
                <p className="font-bold text-navy-800 mt-0.5">{sampleBeamCalculations.spanLength} m</p>
              </div>
              <div>
                <p className="text-navy-400 text-[10px]">CURRENT SECTION</p>
                <p className="font-bold text-steel-700 mt-0.5">{sampleBeamCalculations.currentProfile}</p>
              </div>
              <div>
                <p className="text-navy-400 text-[10px]">RECOMMENDED</p>
                <p className="font-bold text-cyanAccent-700 mt-0.5">{sampleBeamCalculations.recommendedProfile}</p>
              </div>
              <div>
                <p className="text-navy-400 text-[10px]">SAFETY FACTOR</p>
                <p className="font-bold text-emerald-600 mt-0.5">{sampleBeamCalculations.structuralResults.overallSafetyFactor}</p>
              </div>
            </div>

            {/* Moment Diagram Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-heading font-bold text-navy-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-steel-600 text-lg">show_chart</span>
                  Bending Moment M(x) & Shear Force V(x) Distribution
                </h3>
                <span className="text-xs font-mono text-navy-400">Span: 12.5m</span>
              </div>
              <MomentDiagramChart
                spanLength={sampleBeamCalculations.spanLength}
                maxMoment={sampleBeamCalculations.structuralResults.maxBendingMoment}
                maxShear={sampleBeamCalculations.structuralResults.maxShearForce}
              />
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 border-t border-concrete-200">
              <Button
                variant="primary"
                size="sm"
                icon="architecture"
                onClick={() => navigate('/beam-design')}
              >
                Modify Geometry
              </Button>
              <Button
                variant="accent"
                size="sm"
                icon="tips_and_updates"
                onClick={() => navigate('/recommendations')}
              >
                Apply AI Recommendation
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon="description"
                onClick={() => navigate('/reports')}
              >
                Generate Calculation Sheet
              </Button>
            </div>
          </div>
        </div>

        {/* Right Col: Active Projects & AI Suggestions */}
        <div className="space-y-6">
          {/* Active Projects Portfolio Card */}
          <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint">
            <div className="flex items-center justify-between border-b border-concrete-200 pb-3 mb-4">
              <h3 className="font-heading font-bold text-sm text-navy-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600 text-lg">folder_open</span>
                Active Portfolio
              </h3>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-steel-600 hover:underline"
              >
                View all ({initialProjects.length})
              </button>
            </div>

            <div className="space-y-3">
              {initialProjects.slice(0, 3).map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => navigate('/projects')}
                  className="p-3 bg-concrete-50 hover:bg-steel-50/50 rounded border border-concrete-200 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-heading font-bold text-xs text-navy-800">{prj.name}</h4>
                    <p className="text-[11px] font-mono text-navy-500 mt-0.5">{prj.type} • {prj.beamsCount} Beams</p>
                  </div>
                  <Badge variant={prj.status === 'Approved' ? 'green' : 'cyan'} size="sm">
                    {prj.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* AI Decision Support Banner */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 text-white p-5 rounded border border-navy-700 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-cyanAccent-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              AI Recommendation
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Save 2.45 Tons of Structural Steel on Beam B-104
            </h4>
            <p className="text-xs text-navy-200 leading-relaxed">
              Switching from section <strong className="text-white">W24x76</strong> to <strong className="text-cyanAccent-300">W21x62</strong> maintains a 1.41 safety factor while saving $2,450 per member.
            </p>
            <Button
              variant="accent"
              size="sm"
              className="w-full justify-center"
              icon="arrow_forward"
              iconPosition="right"
              onClick={() => navigate('/recommendations')}
            >
              Review Section Trade-off
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
