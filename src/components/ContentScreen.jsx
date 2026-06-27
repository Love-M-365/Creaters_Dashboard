import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

export default function ContentScreen() {
  const { posts, addPost, updatePost, deletePost } = useContext(AppContext);

  // Search and Platform Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformTab, setPlatformTab] = useState('all'); // all, youtube, instagram, tiktok

  // Add post Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newViews, setNewViews] = useState('');
  const [newLikes, setNewLikes] = useState('');
  const [newPlatform, setNewPlatform] = useState('youtube');

  // Edit post states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editViews, setEditViews] = useState('');
  const [editLikes, setEditLikes] = useState('');

  // Filtered posts based on query and tab
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = platformTab === 'all' || post.platform === platformTab;
      return matchesSearch && matchesPlatform;
    });
  }, [posts, searchQuery, platformTab]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const viewsNum = parseInt(newViews) || 0;
    const likesNum = parseInt(newLikes) || 0;

    addPost(newTitle, viewsNum, likesNum, newPlatform);
    
    // Reset and close
    setNewTitle('');
    setNewViews('');
    setNewLikes('');
    setNewPlatform('youtube');
    setIsAddOpen(false);
  };

  const handleEditOpen = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditViews(post.views.toString());
    setEditLikes(post.likes.toString());
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPost || !editTitle.trim()) return;

    updatePost(editingPost.id, {
      title: editTitle,
      views: parseInt(editViews) || 0,
      likes: parseInt(editLikes) || 0
    });

    setEditingPost(null);
  };

  return (
    <section id="content-screen" className="app-screen active">
      <div className="section-header-row" style={{ marginBottom: '14px' }}>
        <h2 className="screen-title" style={{ margin: 0 }}>Content Manager</h2>
        <button 
          className="btn-primary btn-sm" 
          onClick={() => setIsAddOpen(true)}
          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <i className="ph ph-plus-circle" style={{ fontSize: '14px' }}></i> Add Post
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '14px' }}>
        <input 
          type="text" 
          placeholder="Search post titles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ width: '100%', padding: '10px 14px' }}
        />
      </div>

      {/* Platform Tabs */}
      <div className="metric-filters" style={{ marginBottom: '16px' }}>
        <button 
          className={`filter-tab ${platformTab === 'all' ? 'active' : ''}`}
          onClick={() => setPlatformTab('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${platformTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setPlatformTab('youtube')}
        >
          YouTube
        </button>
        <button 
          className={`filter-tab ${platformTab === 'instagram' ? 'active' : ''}`}
          onClick={() => setPlatformTab('instagram')}
        >
          Instagram
        </button>
        <button 
          className={`filter-tab ${platformTab === 'tiktok' ? 'active' : ''}`}
          onClick={() => setPlatformTab('tiktok')}
        >
          TikTok
        </button>
      </div>

      {/* Posts List */}
      <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredPosts.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No content posts found.</p>
          </div>
        ) : (
          filteredPosts.map(post => {
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
              <div key={post.id} className="glass-card post-item" style={{ position: 'relative' }}>
                <img src={post.thumb} alt="Thumbnail" className="post-thumb" />
                <div className="post-details" style={{ marginRight: '40px' }}>
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-stats">
                    <span className="post-stat">
                      <i className="ph ph-play-circle"></i> {post.views.toLocaleString()}
                    </span>
                    <span className="post-stat">
                      <i className="ph ph-heart"></i> {post.likes.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Edit / Delete small links */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '10px' }}>
                    <button 
                      onClick={() => handleEditOpen(post)} 
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <i className="ph ph-pencil-simple"></i> Edit
                    </button>
                    <button 
                      onClick={() => deletePost(post.id)} 
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <i className="ph ph-trash"></i> Delete
                    </button>
                  </div>
                </div>
                
                <div className={`post-platform ${platformClass}`} style={{ position: 'absolute', right: '14px', top: '14px' }}>
                  {platformIcon}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Content Modal Dialog Overlay */}
      {isAddOpen && (
        <>
          <div className="modal-backdrop open" onClick={() => setIsAddOpen(false)} />
          <div className="modal-card open">
            <div className="modal-header">
              <span className="modal-title">Publish New Content</span>
              <button className="modal-close-btn" onClick={() => setIsAddOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label>Post Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. My workspace setup 2026 tour" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Initial Views</label>
                  <input 
                    type="number" 
                    placeholder="2500" 
                    value={newViews}
                    onChange={(e) => setNewViews(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Initial Likes</label>
                  <input 
                    type="number" 
                    placeholder="340" 
                    value={newLikes}
                    onChange={(e) => setNewLikes(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Platform</label>
                <select 
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="form-input"
                  style={{ background: '#0a0a0d' }}
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                Publish Post
              </button>
            </form>
          </div>
        </>
      )}

      {/* Edit Content Modal Dialog Overlay */}
      {editingPost && (
        <>
          <div className="modal-backdrop open" onClick={() => setEditingPost(null)} />
          <div className="modal-card open">
            <div className="modal-header">
              <span className="modal-title">Edit Post Data</span>
              <button className="modal-close-btn" onClick={() => setEditingPost(null)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Views</label>
                  <input 
                    type="number" 
                    value={editViews}
                    onChange={(e) => setEditViews(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Likes</label>
                  <input 
                    type="number" 
                    value={editLikes}
                    onChange={(e) => setEditLikes(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
