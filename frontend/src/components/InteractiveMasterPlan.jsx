import { useState, useMemo } from 'react';
import { MapContainer, ImageOverlay, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import PlotModal from './PlotModal';
import EnquiryModal from './EnquiryModal';
import 'leaflet/dist/leaflet.css';

const STATUS_COLORS = {
  AVAILABLE: '#15803d',
  HOLD: '#c2410c',
  BOOKED: '#1d4ed8',
  SOLD: '#6b7280',
};

// Generates dummy bounds for plots along a grid for demonstration purposes
const generateDummyBounds = (plots) => {
  const bounds = [];
  const startX = 100;
  const startY = 100;
  const plotWidth = 80;
  const plotHeight = 60;
  const gap = 10;
  const cols = 5;

  plots.forEach((plot, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x1 = startX + col * (plotWidth + gap);
    const y1 = startY + row * (plotHeight + gap);
    bounds.push({
      plot,
      positions: [
        [y1, x1],
        [y1 + plotHeight, x1],
        [y1 + plotHeight, x1 + plotWidth],
        [y1, x1 + plotWidth],
      ]
    });
  });
  return bounds;
};

export default function InteractiveMasterPlan({ project, plots, masterPlanUrl }) {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [enquiryPlot, setEnquiryPlot] = useState(null);

  const imageBounds = [[0, 0], [1000, 1000]]; // Using simple CRS bounds
  
  const dummyPolygons = useMemo(() => generateDummyBounds(plots), [plots]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#e2e8f0' }}>
      <MapContainer 
        crs={L.CRS.Simple} 
        bounds={imageBounds} 
        zoomSnap={0.1}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#fff' }}
      >
        <ImageOverlay url={masterPlanUrl} bounds={imageBounds} />
        
        {dummyPolygons.map(({ plot, positions }) => (
          <Polygon 
            key={plot.id}
            positions={positions}
            pathOptions={{ 
              color: STATUS_COLORS[plot.status] || STATUS_COLORS.SOLD,
              fillColor: STATUS_COLORS[plot.status] || STATUS_COLORS.SOLD,
              fillOpacity: 0.6,
              weight: 2
            }}
            eventHandlers={{
              click: () => setSelectedPlot(plot)
            }}
          >
            <Tooltip sticky>
              <div style={{ padding: '4px' }}>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Plot {plot.plotNumber}</strong>
                <span style={{ fontSize: '11px', color: STATUS_COLORS[plot.status], fontWeight: 'bold' }}>{plot.status}</span>
                {plot.area && <div style={{ fontSize: '11px' }}>{plot.area} {plot.areaUnit}</div>}
              </div>
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 'var(--space-6)', right: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)', background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)', zIndex: 1000 }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} /> 
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </div>
        ))}
      </div>

      <PlotModal
        isOpen={!!selectedPlot}
        onClose={() => setSelectedPlot(null)}
        plot={selectedPlot}
        project={project}
        onEnquire={(p) => {
          setSelectedPlot(null);
          setEnquiryPlot(p);
        }}
      />

      <EnquiryModal
        isOpen={!!enquiryPlot}
        onClose={() => setEnquiryPlot(null)}
        project={project}
        plot={enquiryPlot}
        source="WEBSITE"
      />
    </div>
  );
}
