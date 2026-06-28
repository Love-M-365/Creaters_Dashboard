import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

export default function DashboardScreen() {
  const { 
    metrics, 
    activeMetric, 
    setActiveMetric, 
    setActiveScreen, 
    posts, 
    offers, 
    showToast 
  } = useContext(AppContext);

  const activeMetricData = metrics[activeMetric];

  // SVG Chart points calculation
  const chartConfig = useMemo(() => {
    const data = activeMetricData.history;
    const width = 320;
    const height = 130;
    const padding = 20;

    const maxVal = Math.max(...data) * 1.1;
    const minVal = Math.min(...data) * 0.9;
    
    // Map data points
    const points = data.map((val, index) => {
      const x = padding + (width - padding * 2) * (index / (data.length - 1));
      const y = height - padding - (height - padding * 2) * ((val - minVal) / (maxVal - minVal || 1));
      return { x, y, val };
    });

    // Build cubic bezier path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpX1 = points[i].x + (points[i+1].x - points[i].x) / 2;
      const cpY1 = points[i].y;
      const cpX2 = points[i].x + (points[i+1].x - points[i].x) / 2;
      const cpY2 = points[i+1].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i+1].x} ${points[i+1].y}`;
    }

    const areaD = `${pathD} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    // Horizontal grid lines
    const gridLines = [];
    const gridLinesCount = 3;
    for (let i = 0; i <= gridLinesCount; i++) {
      const y = padding + (height - padding * 2) * (i / gridLinesCount);
      gridLines.push(y);
    }

    return { points, pathD, areaD, gridLines, width, height, padding };
  }, [activeMetricData]);

  const handleDotClick = (val, label) => {
    const formattedVal = activeMetric === 'earnings' 
      ? '$' + val.toLocaleString() 
      : val.toLocaleString();
    showToast(`${label} Performance: ${formattedVal}`, 'info');
  };

  return (
    <section id="dashboard-screen" className="app-screen active">
      {/* Dashboard Stats Hero Card */}
      <div className="glass-card dashboard-hero">
        <div className="hero-stats-header">
          <div className="stat-meta">
            <span className="meta-label">
              {activeMetric === 'earnings' && 'Est. Earnings (30d)'}
              {activeMetric === 'views' && 'Total Views (30d)'}
              {activeMetric === 'followers' && 'Followers Count'}
            </span>
            <h2 className="hero-metric">{activeMetricData.total}</h2>
          </div>
          <div className="trend-badge positive">
            <i className="ph-bold ph-arrow-up-right"></i> {activeMetricData.trend}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="metric-filters">
          <button 
            className={`filter-tab ${activeMetric === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveMetric('earnings')}
          >
            Earnings
          </button>
          <button 
            className={`filter-tab ${activeMetric === 'views' ? 'active' : ''}`}
            onClick={() => setActiveMetric('views')}
          >
            Views
          </button>
          <button 
            className={`filter-tab ${activeMetric === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveMetric('followers')}
          >
            Followers
          </button>
        </div>

        {/* Chart View */}
        <div className="chart-container">
          <svg viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`} width="100%" height="100%">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <g className="grid-lines">
              {chartConfig.gridLines.map((y, idx) => (
                <line 
                  key={idx} 
                  x1={chartConfig.padding} 
                  y1={y} 
                  x2={chartConfig.width - chartConfig.padding} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="1" 
                />
              ))}
            </g>

            {/* Gradient Shaded Area */}
            <path className="chart-area" d={chartConfig.areaD} fill="url(#chart-glow)"></path>

            {/* Smooth Spline Curve Line */}
            <path 
              key={activeMetric}
              className="chart-line" 
              d={chartConfig.pathD} 
              fill="none" 
              stroke="var(--primary)" 
              strokeWidth="3" 
              strokeLinecap="round"
            ></path>

            {/* Interactive Circle Dots */}
            <g className="chart-dots">
              {chartConfig.points.map((pt, idx) => (
                <circle 
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="chart-dot"
                  onClick={() => handleDotClick(pt.val, activeMetricData.labels[idx])}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        <button className="action-card" onClick={() => setActiveScreen('content')}>
          <div className="action-icon-wrapper p-violet">
            <i className="ph-bold ph-plus-circle"></i>
          </div>
          <span className="action-label">Add Content</span>
        </button>

        <button className="action-card" onClick={() => setActiveScreen('collabs')}>
          <div className="action-icon-wrapper p-pink">
            <i className="ph-bold ph-handshake"></i>
          </div>
          <span className="action-label">View Deals</span>
          {offers.length > 0 && (
            <span className="badge-mini">{offers.length} Invite{offers.length > 1 && 's'}</span>
          )}
        </button>

        <button className="action-card" onClick={() => setActiveScreen('analytics')}>
          <div className="action-icon-wrapper p-cyan">
            <i className="ph-bold ph-chart-bar"></i>
          </div>
          <span className="action-label">Analytics</span>
        </button>

        <button className="action-card" onClick={() => setActiveScreen('settings')}>
          <div className="action-icon-wrapper p-yellow">
            <i className="ph-bold ph-gear"></i>
          </div>
          <span className="action-label">Preferences</span>
        </button>
      </div>

      {/* Recent Content Feed */}
      <div className="section-header-row">
        <h3 className="section-title">Recent Posts</h3>
        <button 
          className="text-link-btn" 
          onClick={() => setActiveScreen('content')}
        >
          See All
        </button>
      </div>

      <div className="posts-list">
        {posts.slice(0, 3).map(post => {
          let platformIcon = '';
          let platformClass = '';

          if (post.platform === 'youtube') {
            platformIcon = <i className="ph-bold ph-youtube-logo"></i>;
            platformClass = 'text-red';
          } else if (post.platform === 'instagram') {
            platformIcon = <i className="ph-bold ph-instagram-logo"></i>;
            platformClass = 'text-pink';
          } else {
            platformIcon = <i className="ph-bold ph-tiktok-logo"></i>;
            platformClass = 'text-blue';
          }

          return (
            <div key={post.id} className="glass-card post-item">
              <img src={post.thumb} alt="Thumbnail" className="post-thumb" />
              <div className="post-details">
                <h4 className="post-title">{post.title}</h4>
                <div className="post-stats">
                  <span className="post-stat">
                    <i className="ph ph-play-circle"></i> {post.views.toLocaleString()} views
                  </span>
                  <span className="post-stat">
                    <i className="ph ph-heart"></i> {post.likes.toLocaleString()} likes
                  </span>
                </div>
              </div>
              <div className={`post-platform ${platformClass}`}>
                {platformIcon}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
